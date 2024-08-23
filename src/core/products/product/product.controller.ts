import { Post, SetMetadata, UseGuards } from '@nestjs/common'
import { ProductController } from '../decorator'
import { ProductService } from './product.service'
import { JwtAuthGuard, UserRoleGuard } from 'src/guards'
import { UserRole } from 'src/core/user'

@ProductController('item')
export class ProductItemController {
  constructor(private readonly service: ProductService) {}

  // @UseGuards(JwtAuthGuard, UserRoleGuard)
  // @SetMetadata('role', ['store'])
  @Post('insert')
  insertProduct() {
    return { msg: 'inserted' }
  }
}
