import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { User } from 'src/core/user'
import { AddressUser } from 'src/core/address-user'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([User, AddressUser])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
