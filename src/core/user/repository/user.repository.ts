import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../entities'
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>
  ) {}

  async findOne(
    filter: FindOptionsWhere<UserEntity>,
    selected?: (keyof UserEntity)[]
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

  async create(entity: DeepPartial<UserEntity>) {
    const user = this.repo.create(entity)
    const response = await this.repo.save(user)

    return response
  }
}
