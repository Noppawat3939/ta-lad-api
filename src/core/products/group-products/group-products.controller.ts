import { Body, Post, Req, UseGuards } from '@nestjs/common'
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
  @Roles(['store'])
  @Post('insert')
  insertGroup(@Req() req: Request, @Body() dto: InsertGroupProductsDto) {
    const user: IJwtDecodeToken = req.user

    return this.service.insert(user.id, dto)
  }

  @UseGuards(AuthGuard)
  @Roles(['store'])
  @Post('un-group')
  unGroup(@Req() req: Request, @Body() dto: { id: number | number[] }) {
    const user: IJwtDecodeToken = req.user

    return this.service.unGroup(user.id, dto.id)
  }
}
