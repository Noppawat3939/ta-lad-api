import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { AddressUser } from 'src/core/address-user'
import { UserSeller } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([User, AddressUser, UserSeller])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
