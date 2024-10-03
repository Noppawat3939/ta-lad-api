import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductShippingEntity as Entity } from '../entities'
import { DeepPartial, Repository } from 'typeorm'
import type { Where } from 'src/types'

@Injectable()
export class ProductShippingRepository {
  constructor(
    @InjectRepository(Entity) private readonly repo: Repository<Entity>
  ) {}

  async create(entity: DeepPartial<Entity>[]) {
    const response = await this.repo.save(entity)
    return response
  }

  async findOne(filter: Where<Entity>) {
    const response = await this.repo.findOne({ where: filter })
    return response
  }
}
