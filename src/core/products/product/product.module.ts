import { Module, forwardRef } from '@nestjs/common'
import { ProductItemController } from './product.controller'
import { ProductService } from './product.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductEntity } from './entities'
import { SellerProducModule } from '../seller-product'
import { ProductRepository } from './repositoy'
import { ProductImageEntity, ProductImageModule } from '../product-image'
import { ProductCategoryEntity, ProductCategoryRepository } from '../category'

@Module({
  imports: [
    forwardRef(() => SellerProducModule),
    forwardRef(() => ProductImageModule),
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductImageEntity,
      ProductCategoryEntity,
    ]),
  ],
  controllers: [ProductItemController],
  providers: [ProductService, ProductRepository, ProductCategoryRepository],
  exports: [ProductService],
})
export class ProductModule {}
