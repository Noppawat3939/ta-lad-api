import { Module } from '@nestjs/common'
import { ProductItemController } from './product.controller'
import { ProductService } from './product.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductItemController],
  providers: [ProductService],
})
export class ProductModule {}
