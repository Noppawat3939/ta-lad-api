import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductImageEntity as Entity } from '../entities'
import { DeepPartial, Repository } from 'typeorm'

@Injectable()
export class ProductImageRepository {
  constructor(
    @InjectRepository(Entity) private readonly repo: Repository<Entity>
  ) {}

  async create(entity: DeepPartial<Entity>[]) {
    const response = await this.repo.save(entity)
    return response
  }

  async findByProductId(product_id: number) {
    const response = await this.repo.find({
      where: { product_id },
      select: { image: true },
    })
    return response
  }
}
