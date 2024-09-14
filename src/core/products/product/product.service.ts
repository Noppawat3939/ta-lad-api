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
  private checkInvalidPagination(query: Pagination, max_page_size = 50) {
    const isInvalid = [
      !query.page,
      !query.page_size,
      query.page_size && +query.page_size > max_page_size,
    ].some(Boolean)

    return isInvalid
  }

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
    const isInvalid = this.checkInvalidPagination(query)

    if (isInvalid) return error.notccepted('query is invalid')

    const products = await this.pdRepo.findAll(
      { sku: Not(IsNull()) },
      [],
      undefined,
      { page: +query.page, page_size: +query.page_size }
    )
    let data = []

    for (let product of products) {
      const productId = product.id

      const productImages =
        await this.pdImgService.getImageByProductId(productId)

      data.push({
        ...product,
        image: productImages.map((item) => item.image) || null,
      })
    }

    return success('getted products', { data, total: data.length })
  }

  async updateSkuProduct(seller_id: number) {
    const products = await this.pdRepo.findAll({ sku: null }, [
      'id',
      'category_name',
      'created_at',
    ])
    let updateParams: { id: number; sku: string }[] = []

    if (products.length > 0) {
      for (let product of products) {
        const productCategory = await this.pdCategoryRepo.findOne(
          { name: product.category_name },
          ['code']
        )

        const created_at = [
          product.created_at.getFullYear().toString(),
          product.created_at.getMonth().toString().padStart(2, '0'),
          product.created_at.getDate().toString().padStart(2, '0'),
        ].join('')

        if (productCategory.code) {
          const sku = createSkuProduct({
            product_category_code: productCategory.code,
            seller_id,
            product_id: product.id,
            created_at,
          })
          updateParams.push({ id: product.id, sku })
        }
      }

      for (let updateParam of updateParams) {
        await this.pdRepo.updateProduct(updateParam)
      }
    }

    return success('updated sku')
  }

  async getProductBySku(sku: string) {
    const product = await this.pdRepo.findOne({ sku })
    let data: typeof product & { image?: string[] }

    if (product?.id) {
      const productImage = await this.pdImgService.getImageByProductId(
        product.id
      )
      const image = productImage.map((item) => item.image)

      data = {
        ...product,
        image,
      }
    } else {
      data = null
    }

    return success(product === null ? 'product not found' : null, { data })
  }

  async getRelateProductBySku(sku: string, query: Pagination) {
    const isInvalid = this.checkInvalidPagination(query, 20)
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
        { page: +page, page_size: +page_size }
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
