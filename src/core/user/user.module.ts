import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { AddressUserEntity } from 'src/core/address-user'
import { UserSellerEntity } from './entities'
import { UserRepository, UserSellerRepository } from './repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AddressUserEntity, UserSellerEntity]),
  ],
  controllers: [UserController],
  providers: [UserService, UserSellerRepository, UserRepository],
})
export class UserModule {}
