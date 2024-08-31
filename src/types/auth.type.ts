export interface IJwtDecodedVerifyToken {
  code: string
  expired_in: number
  email: string
  iat: number
  exp: number
}

export interface IJwtDecodeToken {
  id: number
  email: string
  session_key: string
  iat: number
  exp: number
  store_name?: string
}
