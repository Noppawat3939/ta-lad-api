import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserSellerEntity as Entity } from '../entities'
import { FindOneOptions, Repository } from 'typeorm'
import { createSelectedAttribute } from 'src/lib'

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
    const select = createSelectedAttribute(selected)

    const response = await this.repo.findOne({
      where: filter,
      select,
    })
    return response
  }
}
