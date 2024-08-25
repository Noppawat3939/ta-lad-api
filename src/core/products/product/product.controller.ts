import { Post, UseGuards } from '@nestjs/common'
import { ProductController } from '../decorator'
import { ProductService } from './product.service'
import { AuthGuard } from 'src/guards'
import { Roles } from 'src/decorator'

@ProductController('item')
export class ProductItemController {
  constructor(private readonly service: ProductService) {}

  @UseGuards(AuthGuard)
  @Roles(['store'])
  @Post('insert')
  insertProduct() {
    return this.service.insertProduct()
  }
}
