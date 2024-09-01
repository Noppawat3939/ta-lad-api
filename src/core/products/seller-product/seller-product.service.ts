import { Injectable } from '@nestjs/common'
import { SellerProductEntity } from './entities'
import { SellerProductRepository } from './repository'
import { DeepPartial } from 'typeorm'

@Injectable()
export class SellerProductService {
  constructor(private repo: SellerProductRepository) {}

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
    const response = await this.repo.findOne({
      product_id,
      seller_id,
    })
    return response?.product
  }
}
