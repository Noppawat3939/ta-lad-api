import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserEntity, UserRepository, UserSellerEntity } from 'src/core/user'
import { AddressUserEntity } from 'src/core/address-user'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { MailModule } from '../mail'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AddressUserEntity, UserSellerEntity]),
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
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    AuthService,
    UserRepository,
  ],
})
export class AuthModule {}
