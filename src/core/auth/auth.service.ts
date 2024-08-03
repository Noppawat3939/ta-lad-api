import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/core/user'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { CreateUserDto, VerifyEmailDto } from './dto'
import { ConfigService } from '@nestjs/config'
import { error, hashCrypto, randomCodeNumber, success } from 'src/lib'
import { JwtService } from '@nestjs/jwt'
import { MailerService } from '@nestjs-modules/mailer'
import { AddressUser } from 'src/core/address-user'
import { IJwtDecodedVerifyToken } from 'src/types'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(AddressUser)
    private adddressUserRepo: Repository<AddressUser>,
    private config: ConfigService,
    private jwt: JwtService,
    private mailer: MailerService
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } })

    if (user) return error.unathorized('user exits')

    const decode: IJwtDecodedVerifyToken = await this.jwt.decode(
      dto.verify_token
    )

    if (decode.code !== dto.code || Date.now() < decode.expired_in) {
      return error.forbidden('verify_token or code invalid')
    }

    const hashedPassword = bcrypt.hashSync(
      dto.password,
      +this.config.getOrThrow('BCRYPT_SALT')
    )
    const hashedIdCard = hashCrypto(dto.id_card)

    const createUserParams = this.userRepo.create({
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      password: hashedPassword,
      id_card: hashedIdCard,
      phone_number: dto.phone_number,
      active: true,
    })

    const addressParams = this.adddressUserRepo.create({
      address_card_id: dto.address_card_id,
      province: dto.province,
      district: dto.district,
      sub_district: dto.sub_district,
    })

    const newUser = await this.userRepo.save(createUserParams)

    if (newUser.id) {
      await this.adddressUserRepo.save({
        ...addressParams,
        user_id: newUser.id,
      })

      return success('created user')
    }
  }

  async verifyEmail({ email }: VerifyEmailDto) {
    const code = randomCodeNumber()

    const payload = {
      code,
      expired_in: new Date().setSeconds(30),
      email,
    }

    const verify_token = this.jwt.sign(payload)

    // await this.mailer.sendMail({
    //   to: 'noppawat3984@gmail.com',
    //   from: 'admin@talad.co.com',
    //   text: 'Hello world',
    // })

    return success(null, { verify_token })
  }
}
