import { Module, forwardRef } from '@nestjs/common'
import { GroupProductsController } from './group-products.controller'
import { GroupProductsService } from './group-products.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupProductsEntity } from './entities'
import { GroupProductsRepository } from './repository'
import { SellerProductModule } from '../seller-product'

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupProductsEntity]),
    forwardRef(() => SellerProductModule),
  ],
  controllers: [GroupProductsController],
  providers: [GroupProductsService, GroupProductsRepository],
})
export class GroupProductsModule {}
