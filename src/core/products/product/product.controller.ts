import { Post, UseGuards } from '@nestjs/common'
import { ProductController } from '../decorator'
import { ProductService } from './product.service'
import { AuthGuard } from 'src/guards'
import { Roles } from 'src/decorator'
import { UserRole } from 'src/core/user'

@ProductController('item')
export class ProductItemController {
  constructor(private readonly service: ProductService) {}

  @UseGuards(AuthGuard)
  @Roles([UserRole.STORE])
  @Post('insert')
  insertProduct() {
    return { msg: 'inserted' }
  }
}
