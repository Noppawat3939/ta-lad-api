import { Post, SetMetadata, UseGuards } from '@nestjs/common'
import { ProductController } from '../decorator'
import { ProductService } from './product.service'
import { AuthGuard } from 'src/guards'

@ProductController('item')
export class ProductItemController {
  constructor(private readonly service: ProductService) {}

  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['store'])
  @Post('insert')
  insertProduct() {
    return { msg: 'inserted' }
  }
}
