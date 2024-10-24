import { SkipThrottle } from '@nestjs/throttler'
import { ProductController } from '../decorator'
import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import { IJwtDecodeToken } from 'src/types'
import { ProductCartService } from './product-cart.service'
import { Roles } from 'src/decorator'
import { AuthGuard } from 'src/guards'
import { InsertProductCartDto } from './dto'
@UseGuards(AuthGuard)
@ProductController('cart')
export class ProductCartController {
  constructor(private readonly service: ProductCartService) {}

  @Roles(['user'])
  @Get()
  getCarts(@Req() req: Request) {
    const user: IJwtDecodeToken = req.user

    return this.service.getCarts(user?.id)
  }

  @SkipThrottle()
  @Roles(['user'])
  @HttpCode(HttpStatus.OK)
  @Post('insert')
  insertCart(@Req() req: Request, @Body() dto: InsertProductCartDto) {
    const user: IJwtDecodeToken = req.user

    return this.service.insertCart(user.id, dto)
  }
}
