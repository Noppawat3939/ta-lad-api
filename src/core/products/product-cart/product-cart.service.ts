import { Injectable } from '@nestjs/common'
import { ProductCartRepository } from './repository'
import { error, success } from 'src/lib'
import { InsertProductCartDto } from './dto'
import { ProductRepository } from '../product/repositoy'
import { IsNull, Not } from 'typeorm'
import { ProductCartStatus } from './enum'

@Injectable()
export class ProductCartService {
  constructor(
    private readonly repo: ProductCartRepository,
    private readonly pdRepo: ProductRepository
  ) {}

  async getCarts(user_id: number) {
    const data = await this.repo.findAll({ user_id })

    return success('getted cart', data)
  }

  async insertCart(user_id: number, dto: InsertProductCartDto) {
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
