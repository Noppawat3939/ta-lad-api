import { ProductController } from '../decorator'
import { ProductService } from './product.service'

@ProductController('item')
export class ProductItemController {
  constructor(private readonly service: ProductService) {}
}
