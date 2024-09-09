import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { createSkuProduct, success } from 'src/lib'
import { InsertProdutDto } from './dto'
import { SellerProductService } from '../seller-product'
import { ProductRepository } from './repositoy'
import { ProductImageService } from '../product-image'
import { ProductCategoryRepository } from '../category'
import { IsNull, Not } from 'typeorm'

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

  async getProductList() {
    const products = await this.pdRepo.findAll({ sku: Not(IsNull()) })
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
}
