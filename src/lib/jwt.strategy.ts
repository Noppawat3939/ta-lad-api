import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import {
  User,
  UserRepositories,
  UserRole,
  UserSeller,
  UserService,
} from 'src/core/user'
import { Repository } from 'typeorm'
import { error } from './response'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    // @Inject(forwardRef(() => UserService))
    // private readonly // private // @InjectRepository(User)
    // userRepo: Repository<User>
    // @InjectRepository(UserSeller)
    // private userSellerRepo: Repository<UserSeller>
    // @InjectRepository(User)
    private readonly userRepo: UserRepositories
  ) {
    const jwtSecret = config.getOrThrow('JWT_SECRET')

    super({
      jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    })
  }

  async validate(payload: {
    id: number
    email: string
    session_key: string
    seller_name?: string
  }) {
    let filter = { email: payload.email }
    let repositoy: Repository<UserSeller | User>

    // if (payload.seller_name) {
    //   repositoy = this.userRepo
    // } else {
    //   repositoy = this.userRepo
    // }

    await this.userRepo.findOne({ email: payload.email }, ['id', 'email'])

    // const response = await repositoy.findOne({
    //   where: filter,
    //   select: {
    //     id: true,
    //     email: true,
    //     role: true,
    //     ...(payload.seller_name && { store_name: true }),
    //     ...(!payload.seller_name && { first_name: true, last_name: true }),
    //   },
    // })
    // if (response.email) return response

    return error.unathorized()
  }
}
