import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  CreateUserDto,
  CreateUserSellerDto,
  LoginUserDto,
  VerifyEmailDto,
} from './dto'
import { SkipThrottle } from '@nestjs/throttler'

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.service.verifyEmail(dto)
  }

  @SkipThrottle()
  @Post('create-user')
  createUser(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto)
  }

  @SkipThrottle()
  @Post('create-user-seller')
  createUserSeller(@Body() dto: CreateUserSellerDto) {
    return this.service.createUserSeller(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login-user')
  loginUser(@Body() dto: LoginUserDto) {
    return this.service.loginUser(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login-seller')
  loginSeller(@Body() dto: LoginUserDto) {
    return this.service.loginUserSeller(dto)
  }
}
