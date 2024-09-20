import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { SellerProductEntity } from './entities'
import { SellerProductRepository } from './repository'
import { DeepPartial, FindOptionsWhere, IsNull, Not } from 'typeorm'
import {
  checkInvalidPagination,
  decodedSkuProduct,
  error,
  success,
} from 'src/lib'
import type { Pagination, Where } from 'src/types'
import { ProductImageService } from '../product-image'

@Injectable()
export class SellerProductService {
  constructor(
    private repo: SellerProductRepository,
    @Inject(forwardRef(() => ProductImageService))
    private pdImgService: ProductImageService
  ) {}

  async createSellerProduct(params: DeepPartial<SellerProductEntity>) {
    const response = await this.repo.create(params)
    return response
  }

  async findProductBySellerId(seller_id: number) {
    const response = await this.repo.findAllAndCount(seller_id)
    return response
  }

  async fineOneProductById<T extends number>({
    seller_id,
    product_id,
  }: {
    seller_id: T
    product_id: T
  }) {
    const response = await this.repo.findOne(
      {
        product_id,
        seller_id,
      },
      ['product']
    )
    return response?.product
  }

  async findAllIncluded(
    filter: Where<SellerProductEntity>,
    include?: ('product' | 'userSeller')[]
  ) {
    const response = await this.repo.findAllIncluded(filter, include)

    return response
  }

  async getListProductBySKU(params: { sku: string } & Pagination) {
    let errMsg: string
    const invalidQuery = checkInvalidPagination(params)

    if (!params.sku || invalidQuery) {
      errMsg = 'query invalid'
    }

    const { isError, seller_id } = decodedSkuProduct(params.sku)

    if (isError) {
      errMsg = 'sku invalid'
    }

    if (errMsg) return error.notccepted(errMsg)

    const sellerProducts = await this.repo.findAllIncluded(
      { seller_id, product: { sku: Not(IsNull()) } },
      ['product', 'userSeller'],
      { page: params.page, page_size: params.page_size }
    )

    let newArriavalList = []
    let allProductList = []
    let seller = {}

    const now = new Date()

    const hasData = sellerProducts.length > 0

    if (hasData) {
      const { store_name, created_at, updated_at, profile_image } =
        sellerProducts[0].userSeller

      const productsSoldout = sellerProducts.map(
        (item) => item.product.sold_amount
      )

      seller = {
        store_name,
        created_at,
        updated_at,
        profile_image,
        product_list_count: sellerProducts.length,
        products_soldout_count: productsSoldout.reduce((c, a) => c + a, 0),
      }

      for (const productItem of sellerProducts) {
        const diff =
          +now - +new Date(productItem.product.created_at.toISOString())
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
        const isNewArriaval = diffDays <= 7 && diffDays >= 0

        const pdImages = (
          await this.pdImgService.getImageByProductId(productItem.product_id)
        ).map((item) => item.image)

        if (isNewArriaval) {
          newArriavalList.push({ ...productItem.product, image: pdImages })
        } else {
          allProductList.push({ ...productItem.product, image: pdImages })
        }
      }
    }

    return success(hasData ? null : 'products not found', {
      data: hasData
        ? {
            all_product: allProductList,
            new_arriaval: newArriavalList,
            seller,
          }
        : null,
    })
  }

  async update(
    filter: FindOptionsWhere<SellerProductEntity>,
    params: DeepPartial<SellerProductEntity>
  ) {
    const response = await this.repo.update(filter, params)
    return response
  }
}
