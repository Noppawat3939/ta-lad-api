import { Module } from '@nestjs/common'
import { GroupProductsController } from './group-products.controller'
import { GroupProductsService } from './group-products.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupProductsEntity } from './entities'
import { GroupProductsRepository } from './repository'

@Module({
  imports: [TypeOrmModule.forFeature([GroupProductsEntity])],
  controllers: [GroupProductsController],
  providers: [GroupProductsService, GroupProductsRepository],
})
export class GroupProductsModule {}
