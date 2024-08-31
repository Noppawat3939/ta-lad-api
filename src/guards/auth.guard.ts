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
import { UserEntity, UserSellerEntity } from 'src/core/user'
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

    if (!requiredRoles) return true

    let payload: IJwtDecodeToken
    let entity: typeof UserSellerEntity | typeof UserEntity
    let filter = {}

    payload = await this.jwt.verifyAsync(token, {
      secret: this.config.get('JWT_SECRET'),
    })

    if (payload.store_name) {
      entity = UserSellerEntity
    } else {
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

    const isAllowed = this.allowRole(requiredRoles, data.role as Role)

    if (!isAllowed) return error.forbidden('not allow')
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
}
