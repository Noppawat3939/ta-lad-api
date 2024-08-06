import { Module } from '@nestjs/common'
import { AddressUserController } from './address-user.controller'
import { AddressUserService } from './address-user.service'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([AddressUserModule])],
  controllers: [AddressUserController],
  providers: [AddressUserService],
})
export class AddressUserModule {}
