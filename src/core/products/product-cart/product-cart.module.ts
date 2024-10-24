import { Module } from '@nestjs/common'
import { ProductCartController } from './product-cart.controller'
import { ProductCartRepository } from './repository'
import { ProductCartService } from './product-cart.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductCartEntity } from './entities'
import { ProductRepository } from '../product/repositoy'
import { ProductEntity } from '../product/entities'

@Module({
  imports: [TypeOrmModule.forFeature([ProductCartEntity, ProductEntity])],
  controllers: [ProductCartController],
  providers: [ProductCartService, ProductCartRepository, ProductRepository],
})
export class ProductCartModule {}
