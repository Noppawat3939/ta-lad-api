import { Module } from '@nestjs/common'
import { ProductCategoryModule } from './category'
import { SellerProductModule } from './seller-product'
import { ProductModule } from './product/product.module'

@Module({
  imports: [ProductCategoryModule, SellerProductModule, ProductModule],
})
export class ProductsModule {}
