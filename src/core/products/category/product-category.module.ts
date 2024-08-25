import { Module } from '@nestjs/common'
import { ProductCategoryService } from './product-category.service'
import { ProductCategoryController } from './product-category.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductCategoryEntity } from './entities'
import { ProductCategoryRepository } from './repository'

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategoryEntity])],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, ProductCategoryRepository],
})
export class ProductCategoryModule {}
