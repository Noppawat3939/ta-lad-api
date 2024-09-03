import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import {
  ValidateEmailDto,
  ValidateIdNumberDto,
  ValidatePhoneNumberDto,
  ValidateStoreNameDto,
} from './dto'
import { SkipThrottle } from '@nestjs/throttler'
import { AuthGuard } from 'src/guards'
import { Request } from 'express'
import { IJwtDecodeToken } from 'src/types'

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('validate')
  validation(
    @Body()
    dto: ValidatePhoneNumberDto &
      ValidateEmailDto &
      ValidateIdNumberDto &
      ValidateStoreNameDto & { role?: string }
  ) {
    const checkStore = dto.role === 'store'
    const { role, ...restDto } = dto

    return this.service.validationField(restDto, checkStore)
  }

  @SkipThrottle()
  @UseGuards(AuthGuard)
  @Get()
  getUser(@Req() req: Request) {
    const user: IJwtDecodeToken = req.user
    return this.service.getUserByRole({ email: user.email, role: user.role })
  }
}
