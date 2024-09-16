import { SkipThrottle } from '@nestjs/throttler'
import { ProductController } from '../decorator'
import { SellerProductService } from './seller-product.service'
import { PrivateKeyGuard } from 'src/guards'
import { Get, Param, Query, UseGuards } from '@nestjs/common'
import { Pagination } from 'src/types'

@ProductController('seller-product')
export class SellerProductController {
  constructor(private readonly service: SellerProductService) {}

  @SkipThrottle()
  @UseGuards(PrivateKeyGuard)
  @Get('list/:sku')
  getListBySku(@Param() { sku }: { sku: string }, @Query() query: Pagination) {
    return this.service.getListProductBySKU({ sku, ...query })
  }
}
