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
}
