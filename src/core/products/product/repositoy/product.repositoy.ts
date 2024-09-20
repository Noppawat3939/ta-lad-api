import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductEntity as Entity } from '../entities'
import { DeepPartial, Repository } from 'typeorm'
import type { Pagination, SortOrder, Where } from 'src/types'
import { createPaginationDB } from 'src/lib'

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
    filter?: Where<Entity>,
    selected?: (keyof Entity)[],
    order?: SortOrder<Entity>,
    pagination?: Pagination
  ) {
    let select = {}
    const hasSelected = selected?.length > 0

    const createdPagination = createPaginationDB(pagination)

    if (hasSelected) {
      selected.forEach((field) => (select[field] = true))
    }

    const response = await this.repo.find({
      where: filter,
      ...(hasSelected && { select }),
      order: order || { created_at: 'desc' },
      ...createdPagination,
    })
    return response
  }

  async findOne(filter: Where<Entity>) {
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
