import { ForbiddenException, UnauthorizedException } from '@nestjs/common'
import type { Nullable } from 'src/types'

export const success = <TMessage extends Nullable<string>, TData>(
  message?: TMessage,
  data?: TData
) => {
  return { success: true, ...(message && { message }), ...(data && { data }) }
}

export const error = {
  unathorized: (message = 'Error Unauthorized') => {
    throw new UnauthorizedException({ message, success: false })
  },
  forbidden: (message = 'Error Forbidden') => {
    throw new ForbiddenException({ message, success: false })
  },
}
