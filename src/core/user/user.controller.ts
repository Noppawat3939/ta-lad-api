import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { UserService } from './user.service'
import {
  ValidateEmailDto,
  ValidateIdNumberDto,
  ValidatePhoneNumberDto,
} from './dto'

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('validate')
  validation(
    @Body() dto: ValidatePhoneNumberDto & ValidateEmailDto & ValidateIdNumberDto
  ) {
    return this.service.validationField(dto)
  }
}
