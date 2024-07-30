import { createHash } from 'crypto'
import { regex } from '.'

type Encoding = 'base64' | 'base64url' | 'hex' | 'binary'

export const validIdNumber = (id: string) => {
  let sum = 0

  if (id.length !== 13 && !regex.number.test(id)) return false

  for (let i = 0; i < 12; i++) {
    sum += Number(id.charAt(i)) * (13 - i)
  }

  let mod = sum % 11

  let check = (11 - mod) % 10

  return check === Number(id.charAt(12))
}

export const hashCrypto = (
  s: string,
  algorithm = 'sha256',
  encoding?: Encoding
) => {
  return createHash(algorithm)
    .update(s)
    .digest(encoding ?? 'hex')
}
