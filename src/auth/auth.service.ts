import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { CreateUserDto } from './dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private config: ConfigService
  ) {}

  async createUser(dto: CreateUserDto) {
    const hashed_id_card = await bcrypt.hash(
      dto.id_card,
      Number(this.config.getOrThrow('BCRYPT_SALT'))
    )

    return 'ok'
  }
}
