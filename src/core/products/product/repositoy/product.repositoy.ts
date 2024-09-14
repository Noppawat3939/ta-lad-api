import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductEntity as Entity } from '../entities'
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm'

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Entity)
    private readonly repo: Repository<Entity>
  ) {}

  async createProduct(entity: DeepPartial<Entity>[]) {
    const response = await this.repo.save(entity)
    return response
  }

  async findAll(
    filter?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    selected?: (keyof Entity)[],
    order?: FindOneOptions<Entity>['order'],
    pagination?: { page?: number; page_size?: number }
  ) {
    let select = {}
    const hasSelected = selected?.length > 0
    const page = pagination?.page || 1
    const pageSize = pagination?.page_size || 50
    const skip = (page - 1) * (pageSize + 1)

    if (hasSelected) {
      selected.forEach((field) => (select[field] = true))
    }

    const response = await this.repo.find({
      where: filter,
      ...(hasSelected && { select }),
      order: order || { created_at: 'desc' },
      take: pageSize,
      skip,
    })
    return response
  }

  async findOne(filter: FindOptionsWhere<Entity>) {
    const response = await this.repo.findOne({ where: filter })
    return response
  }

  async updateProduct(
    entity: DeepPartial<Omit<Entity, 'updated_at' | 'created_at'>>
  ) {
    const { id, ...rest } = entity

    const response = await this.repo.update(id, rest)
    return response
  }
}
