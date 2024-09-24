import {
  Body,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ProductController } from '../decorator'
import { AuthGuard } from 'src/guards'
import { Roles } from 'src/decorator'
import { Request } from 'express'
import type { IJwtDecodeToken } from 'src/types'
import { InsertGroupProductsDto } from './dto'
import { GroupProductsService } from './group-products.service'

@ProductController('group')
export class GroupProductsController {
  constructor(private readonly service: GroupProductsService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Roles(['store'])
  @Post('insert')
  insertGroup(@Req() req: Request, @Body() dto: InsertGroupProductsDto) {
    const user: IJwtDecodeToken = req.user

    return this.service.insert(user.id, dto)
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Roles(['store'])
  @Post('ungroup')
  unGroup(
    @Req() req: Request,
    @Body() { group_product_id }: { group_product_id: number | number[] }
  ) {
    const user: IJwtDecodeToken = req.user

    return this.service.unGroup(user.id, group_product_id)
  }
}
