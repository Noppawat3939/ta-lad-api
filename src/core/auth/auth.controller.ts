import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto, LoginUserDto, VerifyEmailDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.service.verifyEmail(dto)
  }

  @Post('create-user')
  createUser(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login-user')
  loginUser(@Body() dto: LoginUserDto) {
    return this.service.loginUser(dto)
  }
}
