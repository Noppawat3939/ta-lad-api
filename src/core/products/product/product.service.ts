import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { success } from 'src/lib'
import { InsertProdutDto } from './dto'
import { SellerProductService } from '../seller-product'
import { ProductRepository } from './repositoy'
import { ProductImageService } from '../product-image'

@Injectable()
export class ProductService {
  constructor(
    @Inject(forwardRef(() => SellerProductService))
    private readonly sellerProductService: SellerProductService,
    @Inject(forwardRef(() => ProductImageService))
    private pdImgService: ProductImageService,

    private pdRepo: ProductRepository
  ) {}

  async insertProduct(seller_id: number, dto: InsertProdutDto['data']) {
    let createProductList: InsertProdutDto['data'] = []
    let productImagesUrl: string[]

    for (let index = 0; index < dto.length; index++) {
      const productItem = dto[index]

      const { product_image, ...restProductParams } = productItem

      if (product_image?.length > 0) {
        productImagesUrl = product_image
      }

      createProductList.push(restProductParams)
    }

    const newProducts = await this.pdRepo.createProduct(createProductList)

    let promiseFunc = []
    for (let index = 0; index < newProducts.length; index++) {
      const newProduct = newProducts[index]

      if (newProduct) {
        promiseFunc.push(
          this.sellerProductService.createSellerProduct({
            product_id: newProduct.id,
            seller_id,
          })
        )

        if (productImagesUrl?.length > 0) {
          const createProductImageList = productImagesUrl.map((image) => ({
            image,
            product_id: newProduct.id,
          }))

          promiseFunc.push(
            this.pdImgService.insertImage(createProductImageList)
          )
        }

        await Promise.all(promiseFunc)
      }
    }

    return success('inserted product')
  }

  async getSellerProductList(seller_id: number) {
    const [data, total] =
      await this.sellerProductService.findProductBySellerId(seller_id)

    let response = []

    for (let productItem of data) {
      response.push(productItem.product)
    }

    return success(null, { data: response, total })
  }

  async getSellerProductById<T extends number>(seller_id: T, id: T) {
    const data = await this.sellerProductService.fineOneProductById({
      seller_id,
      product_id: id,
    })

    if (!data?.id) return success('product not found', { data: null })

    return success(null, { data })
  }
}
