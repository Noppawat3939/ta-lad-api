import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { error } from 'src/lib'

@Injectable()
export class ExternalGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest()
    const apiKey = req.headers['api-key']

    const isValid = apiKey === this.config.getOrThrow('PRIVATE_KEY')

    return isValid || error.forbidden('not allowed')
  }
}
