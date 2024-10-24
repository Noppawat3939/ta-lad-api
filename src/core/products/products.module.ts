import { Module } from '@nestjs/common'
import { ProductCategoryModule } from './category'
import { SellerProductModule } from './seller-product'
import { ProductModule } from './product/product.module'
import { GroupProductsModule } from './group-products'
import { ProductCartModule } from './product-cart'

@Module({
  imports: [
    ProductCategoryModule,
    SellerProductModule,
    ProductModule,
    GroupProductsModule,
    ProductCartModule,
  ],
})
export class ProductsModule {}
