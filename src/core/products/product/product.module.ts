import { Module, forwardRef } from '@nestjs/common'
import { ProductItemController } from './product.controller'
import { ProductService } from './product.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductEntity } from './entities'
import { SellerProducModule } from '../seller-product'
import { ProductRepository } from './repositoy'
import { ProductImageEntity, ProductImageModule } from '../product-image'

@Module({
  imports: [
    forwardRef(() => SellerProducModule),
    forwardRef(() => ProductImageModule),
    TypeOrmModule.forFeature([ProductEntity, ProductImageEntity]),
  ],
  controllers: [ProductItemController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}
