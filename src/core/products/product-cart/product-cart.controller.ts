import { ProductController } from '../decorator'
import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { SkipThrottle } from '@nestjs/throttler'
@UseGuards(AuthGuard)
@ProductController('cart')
export class ProductCartController {
  constructor(private readonly service: ProductCartService) {}

  @SkipThrottle()
  @Roles(['user', 'store'])
  @Get()
  getCarts(@Req() req: Request) {
    const user: IJwtDecodeToken = req.user
    const isStore = user.role === 'store'

    return this.service.getCarts(user?.id, isStore)
  }

  @Roles(['user'])
  @HttpCode(HttpStatus.OK)
  @Post()
  updateCart(@Req() req: Request, @Body() dto: InsertProductCartDto) {
    const user: IJwtDecodeToken = req.user

    return this.service.updateCart(user.id, dto)
  }

  @Roles(['user'])
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  removeCart(@Req() req: Request, @Param() param: { id: string }) {
    const user: IJwtDecodeToken = req.user

    return this.service.removeCart(user.id, +param.id)
  }
}
