import { checkInvalidPagination } from './../../../lib/utils'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { createSkuProduct, decodedSkuProduct, error, success } from 'src/lib'
import { InsertProdutDto } from './dto'
import { SellerProductService } from '../seller-product'
import { ProductRepository } from './repositoy'
import { ProductImageService } from '../product-image'
import { ProductCategoryRepository } from '../category'
import { ArrayContains, IsNull, MoreThan, Not } from 'typeorm'
import type { Pagination, QueryProduct } from 'src/types'
import { ProductEntity } from './entities'
import { GroupProductsRepository } from '../group-products'
import { ProductShippingRepository } from '../product-shipping'

@Injectable()
export class ProductService {
  constructor(
    @Inject(forwardRef(() => SellerProductService))
    private readonly sellerProductService: SellerProductService,
    @Inject(forwardRef(() => ProductImageService))
    private pdImgService: ProductImageService,

    private pdCategoryRepo: ProductCategoryRepository,
    private pdRepo: ProductRepository,
    private groupPdRepo: GroupProductsRepository,
    private pdShippingRepo: ProductShippingRepository
  ) {}

  async insertProduct(seller_id: number, dto: InsertProdutDto['data']) {
    let createProductList = []
    let productImagesUrl: {
      image: string
      is_main: boolean
      product_id?: number
    }[]
    let createProductShippingParams = []

    for (const createParam of dto) {
      const {
        product_images,
        delivery_time,
        provider,
        shipping_fee,
        ...restParams
      } = createParam

      if (product_images.length > 0) {
        productImagesUrl = product_images
      }

      createProductList.push(restParams)
      createProductShippingParams.push({
        provider,
        delivery_time,
        shipping_fee,
      })
    }

    const createdProduct = await this.pdRepo.create(createProductList)

    let newProductIds: number[] = []

    newProductIds = createdProduct.map((item) => item.id)

    if (newProductIds.length > 0) {
      let promiseFunc = []

      for (const product_id of newProductIds) {
        promiseFunc.push(
          this.sellerProductService.createSellerProduct({
            seller_id,
            product_id,
          })
        )
        const createShippingParams = createProductShippingParams.map(
          (item) => ({ ...item, product_id })
        )
        promiseFunc.push(this.pdShippingRepo.create(createShippingParams))
        const createProductImageParams = productImagesUrl.map((item) => ({
          ...item,
          product_id,
        }))
        promiseFunc.push(
          this.pdImgService.insertImage(createProductImageParams)
        )
      }

      await Promise.all(promiseFunc)
    }

    return success('inserted product')
  }

  async getSellerProductList(seller_id: number) {
    const [data, total] = await this.sellerProductService.findProductBySellerId(
      seller_id,
      ['product', 'groupProduct']
    )

    let response = []

    for (let productItem of data) {
      const pdImage = await this.pdImgService.getImageByProductId(
        productItem.product_id
      )

      const image = pdImage.length > 0 ? pdImage.map((item) => item.image) : []

      if (productItem.groupProduct?.id) {
        delete productItem.groupProduct['seller_id']
      }

      response.push({
        ...productItem['product'],
        image,
        group_product: productItem.groupProduct,
      })
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

  async getProductList(query: Pagination & QueryProduct) {
    const isInvalid = checkInvalidPagination(query)

    if (isInvalid) return error.notccepted('query is invalid')

    let filter: QueryProduct = {}

    if (query.category_name) {
      filter.category_name = query.category_name
    }

    const products = await this.pdRepo.findAll(
      { sku: Not(IsNull()), ...filter },
      [],
      undefined,
      query
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
        await this.pdRepo.update(updateData)
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
    let groupProducts = []

    if (product?.id) {
      const [groupedProducts, productShipping, productImage] =
        await Promise.all([
          this.groupPdRepo.findOne({
            seller_id,
            product_ids: ArrayContains([product.id]),
          }),
          this.pdShippingRepo.findOne({ product_id: product.id }, [
            'id',
            'delivery_time',
            'provider',
            'shipping_fee',
          ]),
          this.pdImgService.getImageByProductId(product.id),
        ])

      if (groupedProducts?.product_ids?.length > 0) {
        for (const productId of groupedProducts.product_ids) {
          const groupProduct = await this.pdRepo.findOne({ id: productId })

          const productImage = (
            await this.pdImgService.getImageByProductId(groupProduct.id)
          ).map((item) => item.image)

          groupProducts.push({ ...groupProduct, image: productImage })
        }
      }

      const image = productImage.map((item) => item.image)
      const { store_name, profile_image, updated_at, created_at } = userSeller

      data = {
        ...product,
        image,
        ...(groupedProducts?.id && {
          group_products: {
            id: groupedProducts.id,
            name: groupedProducts.name,
            products: groupProducts,
          },
        }),
        seller: {
          product_list_count: sellerProducts.length,
          store_name,
          profile_image,
          updated_at,
          created_at,
        },
        product_shipping: productShipping,
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
