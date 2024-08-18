import { Module } from '@nestjs/common'
import { ProductCategoryModule } from './category'

@Module({
  imports: [ProductCategoryModule],
})
export class ProductsModule {}
