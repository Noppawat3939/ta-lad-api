export interface IJwtDecodedVerifyToken {
  code: string
  expired_in: number
  email: string
  iat: number
  exp: number
}
