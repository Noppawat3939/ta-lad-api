import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductCategoryEntity as Entity } from '../entities'
import { DeepPartial, Repository } from 'typeorm'
import type { SortOrder, Where } from 'src/types'
import { createSelectedAttribute } from 'src/lib'

@Injectable()
export class ProductCategoryRepository {
  constructor(
    @InjectRepository(Entity)
    private readonly repo: Repository<Entity>
  ) {}

  async create(entity: DeepPartial<Entity>[]) {
    const response = await this.repo.save(entity)
    return response
  }

  async findAllAndCount(order?: SortOrder<Entity>) {
    const response = await this.repo.findAndCount({
      select: { id: true, name: true, image: true },
      order: order || { id: 'desc' },
    })

    return response
  }

  async findOne(filter?: Where<Entity>, selected?: (keyof Entity)[]) {
    const select = createSelectedAttribute(selected)

    const response = await this.repo.findOne({
      where: filter,
      select,
    })
    return response
  }
}
