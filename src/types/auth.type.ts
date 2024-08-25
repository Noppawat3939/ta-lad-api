import { Role } from './user.type'

export interface IJwtDecodedVerifyToken {
  code: string
  expired_in: number
  email: string
  iat: number
  exp: number
}

export interface IJwtAccessToken {
  id: number
  email: string
  session_key: string
  iat: number
  exp: number
  store_name?: string
  role: Role
}
