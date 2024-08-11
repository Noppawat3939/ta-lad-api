import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities'
import { FindOptionsWhere, Repository } from 'typeorm'

export class userRepository {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async findOne({ filter }: { filter: FindOptionsWhere<User> }) {
    try {
      const response = await this.userRepo.findOne({ where: filter })

      return response
    } catch (err) {
      throw err
    }
  }
}
