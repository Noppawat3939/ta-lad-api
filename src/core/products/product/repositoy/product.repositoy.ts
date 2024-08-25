import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductEntity } from '../entities'
import { DeepPartial, FindOneOptions, Repository } from 'typeorm'

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>
  ) {}

  async createProduct(entity: DeepPartial<ProductEntity>[]) {
    const response = await this.repo.save(entity)
    return response
  }

  async all(
    selected?: (keyof ProductEntity)[],
    order?: FindOneOptions<ProductEntity>['order']
  ) {
    let select = {}
    const hasSelected = selected.length > 0

    if (hasSelected) {
      selected.forEach((field) => (select[field] = true))
    }

    const response = await this.repo.find({
      ...(hasSelected && { select }),
      order: order || { created_at: 'desc' },
    })
    return response
  }

  async updateProduct(
    entity: DeepPartial<Omit<ProductEntity, 'updated_at' | 'created_at'>>
  ) {
    const { id, ...rest } = entity

    const response = await this.repo.update(id, rest)
    return response
  }
}
