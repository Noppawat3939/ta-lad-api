import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductImageEntity } from './entities'
import { ProductImageService } from './product-image.service'
import { ProductModule } from '../product/product.module'
import { ProductImageRepository } from './repository'

@Module({
  imports: [
    forwardRef(() => ProductModule),
    TypeOrmModule.forFeature([ProductImageEntity]),
  ],
  providers: [ProductImageService, ProductImageRepository],
  exports: [ProductImageService],
})
export class ProductImageModule {}
