import { SkipThrottle } from '@nestjs/throttler'
import { ProductController } from '../decorator'
import { SellerProductService } from './seller-product.service'
import { Get, Param, UseGuards } from '@nestjs/common'
import { PrivateKeyGuard } from 'src/guards'

@ProductController('seller-product')
export class SellerProductController {
  constructor(private readonly service: SellerProductService) {}

  @SkipThrottle()
  @UseGuards(PrivateKeyGuard)
  @Get('/:sku')
  getSellerProductBySku(@Param() { sku }: { sku: string }) {
    return this.service.getSellerProductBySku(sku)
  }
}
