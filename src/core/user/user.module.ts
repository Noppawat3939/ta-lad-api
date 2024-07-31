import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { AddressUser } from 'src/address-user'

@Module({
  imports: [TypeOrmModule.forFeature([User, AddressUser])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
