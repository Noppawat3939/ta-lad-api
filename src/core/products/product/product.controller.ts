import { Body, Post, Req, UseFilters, UseGuards } from '@nestjs/common'
import { ProductController } from '../decorator'
import { ProductService } from './product.service'
import { AuthGuard } from 'src/guards'
import { Roles } from 'src/decorator'
import { InsertProdutDto } from './dto'
import { SkipThrottle } from '@nestjs/throttler'
import { ValidateBadReqExceptionFilter } from 'src/exception-filter'
import { Request } from 'express'
import { IJwtDecodeToken } from 'src/types'

@ProductController('item')
@UseFilters(ValidateBadReqExceptionFilter)
export class ProductItemController {
  constructor(private readonly service: ProductService) {}

  @SkipThrottle()
  @UseGuards(AuthGuard)
  @Roles(['store'])
  @Post('insert')
  insertProduct(@Req() req: Request, @Body() dto: InsertProdutDto) {
    const user: IJwtDecodeToken = req.user

    return this.service.insertProduct(user.id, dto['data'])
  }
}
