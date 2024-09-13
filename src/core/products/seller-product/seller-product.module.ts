import { Module, forwardRef } from '@nestjs/common'
import { SellerProductController } from './seller-product.controller'
import { SellerProductService } from './seller-product.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SellerProductEntity } from './entities'
import { ProductModule } from '../product'
import { SellerProductRepository } from './repository'

@Module({
  imports: [
    forwardRef(() => ProductModule),
    TypeOrmModule.forFeature([SellerProductEntity]),
  ],
  controllers: [SellerProductController],
  providers: [SellerProductService, SellerProductRepository],
  exports: [SellerProductService],
})
export class SellerProductModule {}
