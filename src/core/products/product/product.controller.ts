import {
  Body,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { ProductController } from '../decorator'
import { ProductService } from './product.service'
import { AuthGuard } from 'src/guards'
import { Roles } from 'src/decorator'
import { InsertProdutDto } from './dto'
import { SkipThrottle } from '@nestjs/throttler'
import { ValidateBadReqExceptionFilter } from 'src/exception-filter'
import { Request } from 'express'
import { IJwtDecodeToken } from 'src/types'
import { HttpStatusCode } from 'axios'

@ProductController('item')
@UseFilters(ValidateBadReqExceptionFilter)
export class ProductItemController {
  constructor(private readonly service: ProductService) {}

  @SkipThrottle()
  @UseGuards(AuthGuard)
  @Roles(['store'])
  @HttpCode(HttpStatusCode.Ok)
  @Post('insert')
  insertProduct(@Req() req: Request, @Body() dto: InsertProdutDto) {
    const user: IJwtDecodeToken = req.user

    return this.service.insertProduct(user.id, dto['data'])
  }

  @SkipThrottle()
  @UseGuards(AuthGuard)
  @Roles(['store'])
  @HttpCode(HttpStatusCode.Ok)
  @Post('seller')
  getSellerProduct(@Req() req: Request) {
    const seller: IJwtDecodeToken = req.user

    return this.service.getSellerProductList(seller.id)
  }

  @SkipThrottle()
  @UseGuards(AuthGuard)
  @Roles(['store'])
  @HttpCode(HttpStatusCode.Ok)
  @Post('seller/:id')
  getSellerProductById(@Req() req: Request, @Param() { id }: { id: string }) {
    const seller: IJwtDecodeToken = req.user

    return this.service.getSellerProductById(seller.id, +id)
  }

  @SkipThrottle()
  @Get('list')
  getProductList() {
    return this.service.getProductList()
  }
}
