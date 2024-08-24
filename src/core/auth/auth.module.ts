import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { User, UserRepositories, UserSeller } from 'src/core/user'
import { AddressUser } from 'src/core/address-user'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { MailModule } from '../mail'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AddressUser, UserSeller]),
    ThrottlerModule.forRoot([
      {
        limit: 2,
        ttl: 3000,
        blockDuration: 10000,
      },
    ]),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepositories,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AuthModule {}
