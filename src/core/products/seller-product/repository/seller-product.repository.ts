import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SellerProductEntity as Entity } from '../entities'
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class SellerProductRepository {
  constructor(
    @InjectRepository(Entity)
    private repo: Repository<Entity>
  ) {}

  async create(entity: DeepPartial<Entity>) {
    const response = await this.repo.save(entity)

    return response
  }

  async findAllAndCount(seller_id: number) {
    const response = await this.repo.findAndCount({
      where: { seller_id },
      relations: ['product'],
      order: { product: { created_at: 'desc' } },
    })

    return response
  }

  async findOne(filter: FindOptionsWhere<Entity>) {
    const response = await this.repo.findOne({
      where: filter,
      relations: ['product'],
    })
    return response
  }
}
