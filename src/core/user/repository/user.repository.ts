import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities'
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class UserRepositories {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async findOne(filter: FindOptionsWhere<User>, selected?: (keyof User)[]) {
    let select = {}
    const hasSelected = selected.length > 0

    if (hasSelected) {
      selected.forEach((field) => (select[field] = true))
    }

    const response = await this.userRepo.findOne({
      where: filter,
      ...(hasSelected && { select }),
    })

    return response
  }

  create(params: DeepPartial<User>) {
    const response = this.userRepo.create(params)

    return response
  }

  async saveCreate(params: User) {
    const response = await this.userRepo.save(params)

    return response
  }
}
