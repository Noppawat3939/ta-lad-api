import { Injectable } from '@nestjs/common'
import { success } from 'src/lib'

@Injectable()
export class ProductService {
  constructor() {}

  async insertProduct() {
    return success('created product')
  }
}
