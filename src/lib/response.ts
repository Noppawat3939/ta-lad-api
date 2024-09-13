import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import type { Nullable } from 'src/types'

export const success = <TMessage extends Nullable<string>, TData>(
  message?: TMessage,
  data?: TData
) => {
  return { success: true, ...(message && { message }), ...(data && { data }) }
}

export const error = {
  unathorized: (message = 'unauthorized', data?: object) => {
    throw new UnauthorizedException({
      message,
      success: false,
      ...(data && data),
    })
  },
  badrequest: (message = 'bad request', data?: object) => {
    throw new BadRequestException({
      message,
      success: false,
      ...(data && data),
    })
  },
  notccepted: (message = 'not accepted', data?: object) => {
    throw new UnprocessableEntityException({
      message,
      success: false,
      ...(data && data),
    })
  },
  forbidden: (message = 'forbidden', data?: object) => {
    throw new ForbiddenException({ message, success: false, ...(data && data) })
  },
  notfound: (message = 'notFound', data?: object) => {
    throw new NotFoundException({
      message,
      success: false,
      ...(data && data),
    })
  },
}
