import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { ValidateEmailDto, ValidateIdNumberDto } from './dto'

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('validate/identity-number')
  validationIdNumber(@Body() dto: ValidateIdNumberDto) {
    return this.service.validationIdentityNumber(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('validate/email')
  validationEmail(@Body() dto: ValidateEmailDto) {
    return this.service.validationEmail(dto)
  }
}
