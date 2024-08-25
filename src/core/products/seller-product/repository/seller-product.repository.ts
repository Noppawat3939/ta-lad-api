import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SellerProductEntity } from '../entities'
import { DeepPartial, Repository } from 'typeorm'

@Injectable()
export class SellerProductRepository {
  constructor(
    @InjectRepository(SellerProductEntity)
    private repo: Repository<SellerProductEntity>
  ) {}

  async create(entity: DeepPartial<SellerProductEntity>) {
    const response = await this.repo.save(entity)

    return response
  }
}
