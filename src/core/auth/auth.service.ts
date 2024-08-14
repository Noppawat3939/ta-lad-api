import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User, UserRole, UserSeller } from 'src/core/user'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import {
  CreateUserDto,
  CreateUserSellerDto,
  LoginUserDto,
  VerifyEmailDto,
} from './dto'
import { ConfigService } from '@nestjs/config'
import {
  error,
  getStaticTemplate,
  hashCrypto,
  randomCodeNumber,
  randomString,
  success,
} from 'src/lib'
import { JwtService } from '@nestjs/jwt'
import { MailerService } from '@nestjs-modules/mailer'
import { AddressUser } from 'src/core/address-user'
import { IJwtDecodedVerifyToken } from 'src/types'
import { delay } from 'rxjs'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(AddressUser)
    private adddressUserRepo: Repository<AddressUser>,
    @InjectRepository(UserSeller)
    private userSellerRepo: Repository<UserSeller>,

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
      return error.forbidden('verify_token or code invalid', {
        error_message: 'รหัสยืนยันไม่ถูกต้อง',
      })
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
      role: UserRole.USER,
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

  async createUserSeller(dto: CreateUserSellerDto) {
    const seller = await this.userSellerRepo.findOne({
      where: { email: dto.email },
    })

    if (seller) return error.unathorized('seller exits')

    const decode: IJwtDecodedVerifyToken = await this.jwt.decode(
      dto.verify_token
    )

    if (decode.code !== dto.code || Date.now() < decode.expired_in) {
      return error.forbidden('verify_token or code invalid', {
        error_message: 'รหัสยืนยันไม่ถูกต้อง',
      })
    }

    const hashedPassword = bcrypt.hashSync(
      dto.password,
      +this.config.getOrThrow('BCRYPT_SALT')
    )
    const hashedIdCard = hashCrypto(dto.id_card)

    const createSellerParams = this.userSellerRepo.create({
      store_name: dto.store_name,
      email: dto.email,
      password: hashedPassword,
      id_card: hashedIdCard,
      phone_number: dto.phone_number,
    })

    const addressParams = this.adddressUserRepo.create({
      address_card_id: dto.address_card_id,
      province: dto.province,
      district: dto.district,
      sub_district: dto.sub_district,
    })

    const newSeller = await this.userSellerRepo.save(createSellerParams)

    if (newSeller) {
      await this.adddressUserRepo.save({
        ...addressParams,
        user_id: newSeller.id,
      })

      return success('created user')
    }
  }

  async verifyEmail({ email }: VerifyEmailDto) {
    const [user, seller] = await Promise.all([
      this.userRepo.findOne({ where: { email }, select: { email: true } }),
      this.userSellerRepo.findOne({
        where: { email },
        select: { email: true },
      }),
    ])

    if (user || seller) return error.badrequest(`email ${email} exits`)

    const code = randomCodeNumber()

    const payload = {
      code,
      expired_in: new Date().setMinutes(10),
      email,
    }

    const verify_token = this.jwt.sign(payload)

    const html = getStaticTemplate('verify-email').replace(/\[code\]/g, code)

    if (html) {
      delay(1000)

      await this.mailer.sendMail({
        to: email.toLowerCase(),
        from: 'admin@talad.co.com',
        subject: 'ยืนยันการสมัครสมาชิก',
        sender: 'admin@talad.co.com',
        html,
      })
    }

    return success(null, { verify_token })
  }

  async loginUser(dto: LoginUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    })

    if (!user)
      return error.notfound('user not found', {
        error_message: 'ไม่พบผู้ใช้งาน',
      })

    const matched = await bcrypt.compare(dto.password, user.password)

    if (matched) {
      delete user.password

      const session = this.jwt.sign({ ...user, session_key: randomString() })

      return success('login success', {
        data: session,
        timestamps: Date.now(),
      })
    }

    return error.badrequest('email or password invalid', {
      error_message: 'อีเมลล์ หรือ รหัสผ่านไม่ถูกต้อง',
    })
  }

  async loginUserSeller(dto: LoginUserDto) {
    const seller = await this.userSellerRepo.findOne({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        password: true,
        store_name: true,
      },
    })

    if (!seller)
      return error.notfound('user not found', {
        error_message: 'ไม่พบผู้ใช้งาน',
      })

    const matched = await bcrypt.compare(dto.password, seller.password)

    if (matched) {
      delete seller.password

      const session = this.jwt.sign({ ...seller, session_key: randomString() })

      return success('login success', {
        data: session,
        timestamps: Date.now(),
      })
    }

    return error.badrequest('email or password invalid', {
      error_message: 'อีเมลล์ หรือ รหัสผ่านไม่ถูกต้อง',
    })
  }
}
