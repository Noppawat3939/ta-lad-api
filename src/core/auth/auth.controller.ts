import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto, VerifyEmailDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.service.verifyEmail(dto)
  }

  @Post('create-user')
  createUser(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto)
  }
}
