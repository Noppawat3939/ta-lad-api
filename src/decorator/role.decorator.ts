import { SetMetadata } from '@nestjs/common'
import { UserRole } from 'src/core/user'
import { Role } from 'src/types'

export const ROLES_KEY = 'roles'
export const Roles = (roles: Role[]) => SetMetadata(ROLES_KEY, roles)
