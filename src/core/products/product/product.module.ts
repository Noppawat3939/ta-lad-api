import { Module, forwardRef } from '@nestjs/common'
import { ProductItemController } from './product.controller'
import { ProductService } from './product.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductEntity } from './entities'
import { SellerProductModule } from '../seller-product'
import { ProductRepository } from './repositoy'
import { ProductImageEntity, ProductImageModule } from '../product-image'
import { ProductCategoryEntity, ProductCategoryRepository } from '../category'
import { GroupProductsModule } from '../group-products'

@Module({
  imports: [
    forwardRef(() => ProductImageModule),
    forwardRef(() => SellerProductModule),
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductImageEntity,
      ProductCategoryEntity,
    ]),
    GroupProductsModule,
  ],
  providers: [ProductService, ProductRepository, ProductCategoryRepository],
  controllers: [ProductItemController],
  exports: [ProductService],
})
export class ProductModule {}
