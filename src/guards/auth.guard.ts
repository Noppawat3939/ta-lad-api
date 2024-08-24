import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { UserRole } from 'src/core/user'
import { ROLES_KEY } from 'src/decorator'
import { error } from 'src/lib'
import { type IJwtAccessToken } from 'src/types'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler()
    )

    const token = this.extractTokenFromHeader(req)

    if (!token) return error.unathorized()

    if (!requiredRoles) return true

    let payload: IJwtAccessToken

    payload = this.jwt.verify(token, {
      secret: this.config.get('JWT_SECRET'),
    })

    const userSeller = requiredRoles.find((role) => role === UserRole.STORE)

    const isNotAllowed = [
      userSeller && !payload.store_name,
      !userSeller && payload.store_name,
    ].some(Boolean)

    if (isNotAllowed) {
      return error.forbidden('not allow')
    }

    req['user'] = payload

    return true
  }

  private extractTokenFromHeader(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
