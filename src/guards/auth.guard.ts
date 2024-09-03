import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { UserEntity, UserRole, UserSellerEntity } from 'src/core/user'
import { ROLES_KEY } from 'src/decorator'
import { error } from 'src/lib'
import { Role, type IJwtDecodeToken } from 'src/types'
import { DataSource } from 'typeorm'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler()
    )

    const token = this.extractTokenFromHeader(req)

    if (!token) return error.unathorized()

    let payload: IJwtDecodeToken
    let entity: typeof UserSellerEntity | typeof UserEntity
    let filter = {}

    payload = await this.jwt.verifyAsync(token, {
      secret: this.config.get('JWT_SECRET'),
    })

    const isValid = this.validateSessionKey(req, payload.session_key)

    if (!isValid) return error.forbidden('not allowed')

    if (payload.store_name) {
      filter = { email: payload.email, role: UserRole.STORE }
      entity = UserSellerEntity
    } else {
      filter = { email: payload.email, role: UserRole.USER }
      entity = UserEntity
    }

    const data = await this.dataSource.getRepository(entity).findOne({
      where: filter,
      select: {
        id: true,
        email: true,
        role: true,
        ...(payload.store_name && { store_name: true }),
      },
    })

    if (!requiredRoles) {
      req['user'] = data
      return true
    }

    const isAllowed = this.allowRole(requiredRoles, data.role as Role)

    if (!isAllowed) return error.forbidden('not allowed')
    filter = { email: payload.email }

    req['user'] = data

    return true
  }

  private extractTokenFromHeader(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  private allowRole<T extends Role>(requirerdRoles: T[], userRole: T) {
    return requirerdRoles.some((role) => role === userRole)
  }

  private validateSessionKey(req: Request, decodedSessionKey?: string) {
    const sessionKeyHeaders = req.headers['session-key']
    if (sessionKeyHeaders !== decodedSessionKey) {
      console.log('🔑 session-key invalid')
    }
    return sessionKeyHeaders ? sessionKeyHeaders === decodedSessionKey : false
  }
}
