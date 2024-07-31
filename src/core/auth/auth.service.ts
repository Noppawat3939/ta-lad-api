import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/core/user'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { CreateUserDto, VerifyEmailDto } from './dto'
import { ConfigService } from '@nestjs/config'
import { randomCodeNumber } from 'src/lib'
import dayjs from 'dayjs'
import { JwtService } from '@nestjs/jwt'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private config: ConfigService,
    private jwt: JwtService,
    private mailer: MailerService
  ) {}

  async createUser(dto: CreateUserDto) {
    const hashed_id_card = await bcrypt.hash(
      dto.id_card,
      Number(this.config.getOrThrow('BCRYPT_SALT'))
    )

    return 'ok'
  }

  async verifyEmail({ email }: VerifyEmailDto) {
    const code = randomCodeNumber()

    const payload = {
      code,
      expiredIn: '10min',
      email,
    }

    const jwt = this.jwt.sign(payload)

    await this.mailer.sendMail({
      to: 'noppawat3984@gmail.com',
      from: 'admin@talad.co.com',
      text: 'Hello world',
    })

    return { msg: 'ok', jwt }
  }
}
