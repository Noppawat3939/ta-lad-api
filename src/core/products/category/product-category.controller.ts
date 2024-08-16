import { Body, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { ProductController } from '../decorator'
import { InsertProductCategoryDto } from './dto'
import { ProductCategoryService } from './product-category.service'

@ProductController('category')
export class ProductCategoryController {
  constructor(private readonly service: ProductCategoryService) {}

  @Get('list')
  getList() {
    return this.service.getList()
  }

  @Post('insert')
  @UsePipes(ValidationPipe)
  insert(@Body() dto: InsertProductCategoryDto) {
    return this.service.insertCategory(dto)
  }
}
