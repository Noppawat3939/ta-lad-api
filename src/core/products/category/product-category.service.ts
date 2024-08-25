import { Injectable } from '@nestjs/common'
import { InsertProductCategoryDto as InsertDto } from './dto'
import { success } from 'src/lib'
import { ProductCategoryRepository } from './repository'

@Injectable()
export class ProductCategoryService {
  constructor(private pdCategoryRepo: ProductCategoryRepository) {}

  async insertCategory(dto: InsertDto['data']) {
    await this.pdCategoryRepo.create(dto)

    return success('inserted category')
  }

  async getList() {
    const [data, total] = await this.pdCategoryRepo.allAndCount()

    return success(null, { data, total })
  }
}
