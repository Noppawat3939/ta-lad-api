import { Controller, applyDecorators } from '@nestjs/common'

export function ProductController(path: string) {
  return applyDecorators(Controller(`product/${path}`))
}
