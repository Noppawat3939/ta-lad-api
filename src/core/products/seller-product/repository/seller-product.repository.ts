import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SellerProductEntity as Entity } from '../entities'
import { DeepPartial, Repository } from 'typeorm'
import { createPaginationDB } from 'src/lib'
import type { Pagination, Where } from 'src/types'

@Injectable()
export class SellerProductRepository {
  constructor(
    @InjectRepository(Entity)
    private repo: Repository<Entity>
  ) {}

  async create(entity: DeepPartial<Entity>) {
    const response = await this.repo.save(entity)

    return response
  }

  async findAllAndCount(seller_id: number) {
    const response = await this.repo.findAndCount({
      where: { seller_id },
      relations: ['product'],
      order: { product: { created_at: 'desc' } },
    })

    return response
  }

  async findOne(
    filter: Where<Entity>,
    include?: ('product' | 'userSeller')[],
    selected?: {
      product?: (keyof Entity['product'])[]
      userSeler?: (keyof Entity['userSeller'])[]
    }
  ) {
    let select = { product: {}, userSeller: {} }
    const hasSelectedProduct = selected.product?.length > 0
    const hasSelectedSeller = selected.userSeler?.length > 0

    if (hasSelectedProduct) {
      selected['product'].forEach((field) => (select.product[field] = true))
    }
    if (hasSelectedSeller) {
      selected['userSeler'].forEach(
        (field) => (select.userSeller[field] = true)
      )
    }

    const response = await this.repo.findOne({
      where: filter,
      relations: include,
      select,
    })
    return response
  }

  async countSellerProduct(filter: Where<Entity>) {
    const response = await this.repo.count({ where: filter })
    return response
  }

  async findAllIncluded(
    filter: Where<Entity>,
    include?: ['product', 'userSeller'],
    pagination?: Pagination
  ) {
    const createdPagination = createPaginationDB(pagination)

    const response = await this.repo.find({
      where: filter,
      relations: include || ['product'],
      order: { id: 'desc' },
      ...createdPagination,
    })
    return response
  }
}
