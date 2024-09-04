import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductCategoryEntity as Entity } from '../entities'
import { DeepPartial, FindOneOptions, Repository } from 'typeorm'

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

  async findAllAndCount(order?: FindOneOptions<Entity>['order']) {
    const response = await this.repo.findAndCount({
      select: { id: true, name: true, image: true },
      order: order || { id: 'desc' },
    })

    return response
  }
}
