import { ProductController } from '../decorator'
import { SellerProductService } from './seller-product.service'

@ProductController('seller-product')
export class SellerProductController {
  constructor(private readonly service: SellerProductService) {}
}
