import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { User, UserRole, UserSeller } from 'src/core/user'
import { error } from 'src/lib'

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'role',
      context.getHandler()
    )

    if (!requiredRoles) return true

    console.log({ requiredRoles })

    const request = context.switchToHttp().getRequest()
    const user: User | UserSeller = request.user

    const isAllowed = requiredRoles.includes(user.role)

    if (!isAllowed) return error.forbidden('user not permission')

    return false
  }
}
