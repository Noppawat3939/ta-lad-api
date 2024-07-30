import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { ValidateIdNumberDto } from './dto'

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('validate/identity-number')
  createUser(@Body() dto: ValidateIdNumberDto) {
    return this.service.validationIdentityNumber(dto)
  }
}
