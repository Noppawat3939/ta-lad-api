import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { User } from 'src/user'
import { AddressUser } from 'src/address-user'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([User, AddressUser])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
