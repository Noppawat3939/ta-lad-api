import { Module, forwardRef } from '@nestjs/common'
import { ProductCartController } from './product-cart.controller'
import { ProductCartRepository } from './repository'
import { ProductCartService } from './product-cart.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductCartEntity } from './entities'
import { ProductRepository } from '../product/repositoy'
import { ProductEntity } from '../product/entities'
import { SellerProductModule } from '../seller-product'
import { ProductImageModule } from '../product-image'

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductCartEntity, ProductEntity]),
    forwardRef(() => SellerProductModule),
    forwardRef(() => ProductImageModule),
  ],
  controllers: [ProductCartController],
  providers: [ProductCartService, ProductCartRepository, ProductRepository],
})
export class ProductCartModule {}
