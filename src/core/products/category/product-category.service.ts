import { Injectable } from '@nestjs/common'
import { InsertProductCategoryDto } from './dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductCategory } from './entities'
import { Repository } from 'typeorm'
import { success } from 'src/lib'

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private pdCategory: Repository<ProductCategory>
  ) {}

  async insertCategory({ data }: InsertProductCategoryDto) {
    let createParamList = []

    for (let i = 0; i < data.length; i++) {
      const rowData = data[i]

      const createParams = this.pdCategory.create(rowData)
      createParamList.push(createParams)
    }

    await this.pdCategory.save(createParamList)

    return success(`inserted category ${createParamList.length} orders`)
  }

  async getList() {
    const [data, total] = await this.pdCategory.findAndCount({
      order: { id: 'DESC' },
    })

    return success(null, { data, total })
  }
}
