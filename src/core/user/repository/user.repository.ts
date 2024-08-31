import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity as Entity } from '../entities'
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Entity)
    private repo: Repository<Entity>
  ) {}

  async findOne(filter: FindOptionsWhere<Entity>, selected?: (keyof Entity)[]) {
    let select = {}
    const hasSelected = selected.length > 0

    if (hasSelected) {
      selected.forEach((field) => (select[field] = true))
    }

    const response = await this.repo.findOne({
      where: filter,
      ...(hasSelected && { select }),
    })

    return response
  }

  async create(entity: DeepPartial<Entity>) {
    const response = await this.repo.save(entity)

    return response
  }
}
