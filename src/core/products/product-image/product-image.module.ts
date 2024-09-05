import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductImageEntity } from './entities'
import { ProductImageService } from './product-image.service'
import { ProductImageRepository } from './repository'

@Module({
  imports: [TypeOrmModule.forFeature([ProductImageEntity])],
  providers: [ProductImageService, ProductImageRepository],
  exports: [ProductImageService],
})
export class ProductImageModule {}
