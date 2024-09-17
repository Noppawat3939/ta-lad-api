import { Module } from '@nestjs/common'
import { GroupProductsController } from './group-products.controller'
import { GroupProductsService } from './group-products.service'

@Module({
  controllers: [GroupProductsController],
  providers: [GroupProductsService],
})
export class GroupProductsModule {}
