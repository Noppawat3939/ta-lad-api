import { Injectable } from '@nestjs/common'
import { InsertGroupProductsDto } from './dto'
import { GroupProductsRepository } from './repository'

@Injectable()
export class GroupProductsService {
  constructor(private repo: GroupProductsRepository) {}

  async insert(seller_id: number, dto: InsertGroupProductsDto) {
    return 'inserted'
  }
}
