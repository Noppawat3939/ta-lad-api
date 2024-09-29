import { Injectable } from '@nestjs/common'
import { ProductImageRepository } from './repository'
import { ProductImageEntity } from './entities'
import { DeepPartial } from 'typeorm'
import type { Where } from 'src/types'

type OmiitedId = Omit<ProductImageEntity, 'id'>

@Injectable()
export class ProductImageService {
  constructor(private pdImageRepo: ProductImageRepository) {}

  async insertImage(dto: DeepPartial<OmiitedId>[]) {
    if (Object.values(dto).length === 0) return

    const data = await this.pdImageRepo.create(dto)

    return data
  }

  async getImageByProductId(product_id: number) {
    const data = await this.pdImageRepo.findByProductId(product_id)

    return data
  }

  async findOneImageProduct(filter: Where<ProductImageEntity>) {
    const data = await this.pdImageRepo.findOne(filter)

    return data
  }
}
