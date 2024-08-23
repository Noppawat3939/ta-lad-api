import { Module } from '@nestjs/common'
import { SellerProductController } from './seller-product.controller'
import { SellerProductService } from './seller-product.service'

@Module({
  imports: [],
  controllers: [SellerProductController],
  providers: [SellerProductService],
})
export class SellerProducModule {}
