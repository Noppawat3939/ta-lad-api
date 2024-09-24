import { Module } from '@nestjs/common'
import { ProductCategoryModule } from './category'
import { SellerProductModule } from './seller-product'
import { ProductModule } from './product/product.module'
import { GroupProductsModule } from './group-products'

@Module({
  imports: [
    ProductCategoryModule,
    SellerProductModule,
    ProductModule,
    GroupProductsModule,
  ],
})
export class ProductsModule {}
