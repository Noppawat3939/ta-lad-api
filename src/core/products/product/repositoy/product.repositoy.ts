import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductEntity as Entity } from '../entities'
import { DeepPartial, Repository } from 'typeorm'
import type { Pagination, SortOrder, Where } from 'src/types'
import { createPaginationDB, createSelectedAttribute } from 'src/lib'

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Entity)
    private readonly repo: Repository<Entity>
  ) {}

  async create(entity: DeepPartial<Entity>[]) {
    const response = await this.repo.save(entity)
    return response
  }

  async findAll(
    filter?: Where<Entity>,
    selected?: (keyof Entity)[],
    order?: SortOrder<Entity>,
    pagination?: Pagination
  ) {
    const createdPagination = createPaginationDB(pagination)

    const select = createSelectedAttribute(selected)

    const response = await this.repo.find({
      where: filter,
      select,
      order: order || { created_at: 'desc' },
      ...createdPagination,
    })
    return response
  }

  async findOne(filter: Where<Entity>, selected?: (keyof Entity)[]) {
    const select = createSelectedAttribute(selected)

    const response = await this.repo.findOne({ where: filter, select })
    return response
  }

  async update(entity: DeepPartial<Omit<Entity, 'updated_at' | 'created_at'>>) {
    const { id, ...rest } = entity

    const response = await this.repo.update(id, rest)
    return response
  }
}
