import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { ProductCartRepository } from './repository'
import { error, success } from 'src/lib'
import { InsertProductCartDto } from './dto'
import { ProductRepository } from '../product/repositoy'
import { In, IsNull, Not } from 'typeorm'
import { ProductCartStatus } from './enum'
import { SellerProductRepository } from '../seller-product/repository'
import { ProductImageService } from '../product-image'

@Injectable()
export class ProductCartService {
  constructor(
    private readonly repo: ProductCartRepository,
    private readonly pdRepo: ProductRepository,

    @Inject(forwardRef(() => SellerProductRepository))
    private sellerPdRepo: SellerProductRepository,

    @Inject(forwardRef(() => ProductImageService))
    private pdImgService: ProductImageService
  ) {}

  async getCarts(user_id: number, isStore = false) {
    let data = []

    if (isStore) {
      const [sellerProducts, sellerProductCount] =
        await this.sellerPdRepo.findAllAndCount(user_id)

      if (sellerProductCount > 0) {
        const productIds = sellerProducts.map((item) => item.product_id)

        const productCarts = await this.repo.findAll(
          {
            product_id: In(productIds),
          },
          undefined,
          ['product', 'user']
        )
        let dataValues = []

        for (const cart of productCarts) {
          const { user, ...restData } = cart
          dataValues.push({
            ...restData,
            user: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              profile_image: user.profile_image,
            },
          })
        }

        data = dataValues
      }
    } else {
      const response = await this.repo.findAll({ user_id })

      for (const item of response) {
        const productImages = await this.pdImgService.getImageByProductId(
          item.product_id
        )

        const mappedImages = productImages.map((itemImg) => {
          if (itemImg.is_main) return itemImg.image

          return itemImg.image
        })

        data.push({
          ...item,
          product: { ...item.product, image: mappedImages },
        })
      }
    }

    return success(data.length > 0 ? 'getted cart' : 'no cart', data || [])
  }

  async updateCart(user_id: number, dto: InsertProductCartDto) {
    const product = await this.pdRepo.findOne({
      id: dto.product_id,
      sku: Not(IsNull()),
    })

    if (!product)
      return error.notfound('product not found', {
        error_message: 'ไม่พบสินค้า',
      })

    if (dto.amount > product.stock_amount) {
      return error.notccepted('not accepted', {
        error_message: 'จำนวนสินค้าไม่เพียงพอ',
      })
    }

    const productCart = await this.repo.findOne({
      product_id: product.id,
      status: ProductCartStatus.OPEN,
    })

    const { id, price, stock_amount } = product

    const productStockUpdated = stock_amount > 0 ? stock_amount - dto.amount : 0

    if (!productCart?.id) {
      await Promise.all([
        this.repo.create({ user_id, ...dto, price }),
        this.pdRepo.update({ id, stock_amount: productStockUpdated }),
      ])

      return success('inserted cart')
    } else {
      const amountUpdated = productCart.amount + dto.amount

      await Promise.all([
        this.repo.update({ id: productCart.id, amount: amountUpdated }),
        this.pdRepo.update({ id, stock_amount: productStockUpdated }),
      ])

      return success('updated cart')
    }
  }

  async removeCart<T extends number>(user_id: T, id: T) {
    const productCart = await this.repo.findOne({
      id,
      user_id,
      status: ProductCartStatus.OPEN,
    })

    if (productCart?.id) {
      const { product_id, amount } = productCart
      const product = await this.pdRepo.findOne({ id: product_id }, [
        'id',
        'stock_amount',
      ])

      const productStockUpdated = product.stock_amount + amount

      await Promise.all([
        this.repo.delete(productCart.id),
        this.pdRepo.update({
          id: product_id,
          stock_amount: productStockUpdated,
        }),
      ])
      return success(`removed cart_id ${id}`)
    } else {
      return error.notfound('product not found', {
        error_message: 'ไม่พบตระกร้าสินค้า',
      })
    }
  }
}
