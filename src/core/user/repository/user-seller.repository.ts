import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserSellerEntity as Entity } from '../entities'
import { FindOneOptions, Repository } from 'typeorm'

@Injectable()
export class UserSellerRepository {
  constructor(
    @InjectRepository(Entity)
    private repo: Repository<Entity>
  ) {}

  async findOne(
    filter: FindOneOptions<Entity>['where'],
    selected?: (keyof Entity)[]
  ) {
    let select = {}

    const hasSelected = selected?.length > 0
    if (hasSelected) {
      selected.forEach((field) => (select[field] = true))
    }

    const response = await this.repo.findOne({
      where: filter,
      ...(hasSelected && { select }),
    })
    return response
  }
}
