import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { success } from 'src/lib'
import { InsertProdutDto } from './dto'
import { SellerProductService } from '../seller-product'
import { ProductRepository } from './repositoy'

@Injectable()
export class ProductService {
  constructor(
    @Inject(forwardRef(() => SellerProductService))
    private readonly sellerProductService: SellerProductService,

    private repo: ProductRepository
  ) {}

  async insertProduct(seller_id: number, dto: InsertProdutDto['data']) {
    const newProducts = await this.repo.createProduct(dto)

    for (let index = 0; index < newProducts.length; index++) {
      const product = newProducts[index]

      if (product) {
        await this.sellerProductService.createSellerProduct({
          product_id: product.id,
          seller_id,
        })
      }
    }

    return success('created product')
  }
}
