import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities'
import { FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class UserRepositories {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async findOne(
    filter: FindOptionsWhere<User>,
    selected?: Exclude<keyof User, 'password'>[]
  ) {
    let select = {}
    const hasSelected = selected.length > 0

    if (hasSelected) {
      selected.forEach((field) => (select[field] = true))
    }

    const user = await this.userRepo.findOne({
      where: filter,
      ...(hasSelected && { select }),
    })

    return user
  }
}
