import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GroupProductsEntity as Entity } from '../entities'
import { DeepPartial, Repository } from 'typeorm'
import type { Where } from 'src/types'

@Injectable()
export class GroupProductsRepository {
  constructor(
    @InjectRepository(Entity) private readonly repo: Repository<Entity>
  ) {}

  async create(entity: DeepPartial<Entity>) {
    const response = await this.repo.save(entity)
    return response
  }

  async findOne(filter: Where<Entity>) {
    const response = await this.repo.findOne({ where: filter })
    return response
  }

  async findAll(filter: Where<Entity>) {
    const response = await this.repo.find({ where: filter })
    return response
  }

  async updateById(id: number, entity: DeepPartial<Entity>) {
    const response = await this.repo.update(id, entity)
    return response
  }

  async deleteById(id: number) {
    const response = await this.repo.delete(id)
    return response
  }
}
