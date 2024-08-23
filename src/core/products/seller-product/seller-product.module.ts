import { Module } from '@nestjs/common'
import { SellerProductController } from './seller-product.controller'
import { SellerProductService } from './seller-product.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SellerProduct } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([SellerProduct])],
  controllers: [SellerProductController],
  providers: [SellerProductService],
})
export class SellerProducModule {}
