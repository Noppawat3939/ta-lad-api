import { checkInvalidPagination } from './../../../lib/utils'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { createSkuProduct, decodedSkuProduct, error, success } from 'src/lib'
import { InsertProdutDto } from './dto'
import { SellerProductService } from '../seller-product'
import { ProductRepository } from './repositoy'
import { ProductImageService } from '../product-image'
import { ProductCategoryRepository } from '../category'
import { IsNull, MoreThan, Not } from 'typeorm'
import type { Pagination } from 'src/types'
import { ProductEntity } from './entities'

@Injectable()
export class ProductService {
  constructor(
    @Inject(forwardRef(() => SellerProductService))
    private readonly sellerProductService: SellerProductService,
    @Inject(forwardRef(() => ProductImageService))
    private pdImgService: ProductImageService,

    private pdCategoryRepo: ProductCategoryRepository,
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
      const pdImage = await this.pdImgService.getImageByProductId(
        productItem.product_id
      )

      const image = pdImage.length > 0 ? pdImage.map((item) => item.image) : []

      response.push({ ...productItem['product'], image })
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

  async getProductList(query: Pagination) {
    const isInvalid = checkInvalidPagination(query)

    if (isInvalid) return error.notccepted('query is invalid')

    const products = await this.pdRepo.findAll(
      { sku: Not(IsNull()) },
      [],
      undefined,
      { page: query.page, page_size: query.page_size }
    )
    let data = []

    for (let product of products) {
      const productId = product.id

      const { image: productImage } =
        await this.pdImgService.findOneImageProduct({
          product_id: productId,
        })

      data.push({
        ...product,
        image: [productImage],
      })
    }

    return success('getted products', { data, total: data.length })
  }

  async updateSkuProduct(seller_id: number) {
    const products = await this.sellerProductService.findAllIncluded({
      seller_id,
      product: { sku: IsNull() },
    })

    let updateDataList: { id: number; sku: string }[] = []

    if (products.length > 0) {
      for (let productItem of products) {
        const {
          product: { id: pdId, category_name, created_at: pdCreatedAt },
        } = productItem

        const productCategory = await this.pdCategoryRepo.findOne(
          { name: category_name },
          ['code']
        )

        const created_at = [
          pdCreatedAt.getFullYear().toString(),
          pdCreatedAt.getMonth().toString().padStart(2, '0'),
          pdCreatedAt.getDate().toString().padStart(2, '0'),
        ].join('')

        if (productCategory.code) {
          const sku = createSkuProduct({
            product_category_code: productCategory.code,
            seller_id,
            product_id: pdId,
            created_at,
          })
          updateDataList.push({ id: pdId, sku })
        }
      }

      for (const updateData of updateDataList) {
        await this.pdRepo.updateProduct(updateData)
      }
    }

    return success(products.length > 0 ? 'updated sku' : 'all data updated sku')
  }

  async getProductBySku(sku: string) {
    const { product_id, isError, seller_id } = decodedSkuProduct(sku)

    if (isError) return error.notccepted('sku invalid')
    const sellerProducts = await this.sellerProductService.findAllIncluded(
      {
        seller_id,
      },
      ['product', 'userSeller']
    )

    const foundProduct = sellerProducts.find(
      (item) => item.product_id === product_id
    )
    const { product, userSeller } = foundProduct
    let data: unknown

    if (product?.id) {
      const productImage = await this.pdImgService.getImageByProductId(
        product.id
      )
      const image = productImage.map((item) => item.image)
      const { store_name, profile_image, updated_at, created_at } = userSeller

      data = {
        ...product,
        image,
        seller: {
          product_list_count: sellerProducts.length,
          store_name,
          profile_image,
          updated_at,
          created_at,
        },
      }
    } else {
      data = null
    }

    return success(!data ? 'product not found' : null, { data })
  }

  async getRelateProductBySku(sku: string, query: Pagination) {
    const isInvalid = checkInvalidPagination(query, 20)
    const { isError: skuInvalid, product_category_code } =
      decodedSkuProduct(sku)

    if (skuInvalid || isInvalid)
      return error.notccepted(`${skuInvalid ? 'sku' : 'query'} invalid`)

    const category = await this.pdCategoryRepo.findOne(
      {
        code: product_category_code,
      },
      ['name']
    )

    if (category?.name) {
      const { page, page_size } = query

      let data: (ProductEntity & { image: string[] })[] = []

      const products = await this.pdRepo.findAll(
        {
          category_name: category.name,
          stock_amount: MoreThan(0),
          sku: Not(sku),
        },
        [
          'id',
          'brand',
          'sku',
          'product_name',
          'category_name',
          'price',
          'discount_end_date',
          'discount_percent',
          'discount_price',
          'discount_start_date',
        ],
        { id: 'desc' },
        { page, page_size }
      )

      for (const product of products) {
        const productImages = await this.pdImgService.getImageByProductId(
          product.id
        )
        const image = productImages.map(({ image }) => image)

        data.push({ ...product, image })
      }

      return success(null, { total: data.length, data })
    }

    return success('products not found', [])
  }
}
