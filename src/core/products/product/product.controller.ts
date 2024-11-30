import {
  Body,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { ProductController } from '../decorator'
import { ProductService } from './product.service'
import { AuthGuard, PrivateKeyGuard } from 'src/guards'
import { Roles } from 'src/decorator'
import { InsertProdutDto } from './dto'
import { SkipThrottle } from '@nestjs/throttler'
import { ValidateBadReqExceptionFilter } from 'src/exception-filter'
import { Request } from 'express'
import { IJwtDecodeToken, Pagination, QueryProduct } from 'src/types'
import { HttpStatusCode } from 'axios'

@ProductController('item')
@UseFilters(ValidateBadReqExceptionFilter)
@SkipThrottle()
export class ProductItemController {
  constructor(private readonly service: ProductService) {}

  @UseGuards(AuthGuard)
  @Roles(['store'])
  @HttpCode(HttpStatusCode.Ok)
  @Post('insert')
  insertProduct(@Req() req: Request, @Body() dto: InsertProdutDto) {
    const user: IJwtDecodeToken = req.user

    return this.service.insertProduct(user.id, dto['data'])
  }

  @UseGuards(AuthGuard)
  @Roles(['store'])
  @HttpCode(HttpStatusCode.Ok)
  @Post('seller')
  getSellerProduct(@Req() req: Request) {
    const seller: IJwtDecodeToken = req.user

    return this.service.getSellerProductList(seller.id)
  }

  @UseGuards(AuthGuard)
  @Roles(['store'])
  @HttpCode(HttpStatusCode.Ok)
  @Post('seller/:id')
  getSellerProductById(@Req() req: Request, @Param() { id }: { id: string }) {
    const seller: IJwtDecodeToken = req.user

    return this.service.getSellerProductById(seller.id, +id)
  }

  @UseGuards(PrivateKeyGuard)
  @Get('list')
  getProductList(@Query() query: Pagination & QueryProduct) {
    return this.service.getProductList(query)
  }

  @UseGuards(AuthGuard)
  @Roles(['store'])
  @HttpCode(HttpStatusCode.Ok)
  @Post('sku/update')
  updateSku(@Req() req: Request) {
    const seller: IJwtDecodeToken = req.user

    return this.service.updateSkuProduct(seller.id)
  }

  @UseGuards(PrivateKeyGuard)
  @Get('/:sku')
  getProductItem(@Param() { sku }: { sku: string }) {
    return this.service.getProductBySku(sku)
  }

  @UseGuards(PrivateKeyGuard)
  @Get('/relate/:sku')
  getRelateProductBySku(
    @Param() { sku }: { sku: string },
    @Query() query: Pagination
  ) {
    return this.service.getRelateProductBySku(sku, query)
  }
}
