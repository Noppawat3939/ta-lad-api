import { Module } from '@nestjs/common'
import { ProductCategoryModule } from './category'
import { ProductController } from './decorator'
import { RouterModule } from '@nestjs/core'

@Module({
  imports: [
    ProductCategoryModule,
    // RouterModule.register([{ path: 'product', module: ProductCategoryModule }]),
  ],
})
export class ProductsModule {}
