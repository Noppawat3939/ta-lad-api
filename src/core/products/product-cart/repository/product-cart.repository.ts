import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { ProductCartEntity as Entity } from '../entities'
import type { IncludeProductCart, Where } from 'src/types'
import { createSelectedAttribute } from 'src/lib'

@Injectable()
export class ProductCartRepository {
  constructor(
    @InjectRepository(Entity) private readonly repo: Repository<Entity>
  ) {}

  async findAll(
    filter: Where<Entity>,
    selected?: (keyof Entity)[],
    include?: IncludeProductCart
  ) {
    const select = createSelectedAttribute(selected)

    const response = await this.repo.find({
      where: filter,
      select,
      relations: include || ['product'],
      order: { created_at: 'desc' },
    })
    return response
  }

  async findOne(filter: Where<Entity>, selected?: (keyof Entity)[]) {
    const select = createSelectedAttribute(selected)

    const response = await this.repo.findOne({ where: filter, select })
    return response
  }

  async create(entiry: DeepPartial<Entity>) {
    const response = await this.repo.save(entiry)
    return response
  }

  async update(entity: DeepPartial<Omit<Entity, 'updated_at' | 'created_at'>>) {
    const { id, ...rest } = entity

    const response = await this.repo.update(id, rest)
    return response
  }

  async delete(id: number) {
    const response = await this.repo.delete({ id })
    return response
  }
}
