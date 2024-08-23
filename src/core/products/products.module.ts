import { Module } from '@nestjs/common'
import { ProductCategoryModule } from './category'
import { SellerProducModule } from './seller-product'
import { ProductModule } from './product/product.module'

@Module({
  imports: [ProductCategoryModule, SellerProducModule, ProductModule],
})
export class ProductsModule {}
