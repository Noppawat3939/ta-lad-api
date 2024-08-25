import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserSellerEntity } from '../entities'
import { FindOneOptions, Repository } from 'typeorm'

@Injectable()
export class UserSellerRepository {
  constructor(
    @InjectRepository(UserSellerEntity)
    private repo: Repository<UserSellerEntity>
  ) {}

  async findOne(
    filter: FindOneOptions<UserSellerEntity>['where'],
    selected?: (keyof UserSellerEntity)[]
  ) {
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
}
