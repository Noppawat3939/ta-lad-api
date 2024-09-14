import { Injectable } from '@nestjs/common'
import { SellerProductEntity } from './entities'
import { SellerProductRepository } from './repository'
import { DeepPartial, FindOptionsWhere, IsNull, Not } from 'typeorm'
import { decodedSkuProduct, success, error } from 'src/lib'

@Injectable()
export class SellerProductService {
  constructor(private repo: SellerProductRepository) {}

  async createSellerProduct(params: DeepPartial<SellerProductEntity>) {
    const response = await this.repo.create(params)
    return response
  }

  async findProductBySellerId(seller_id: number) {
    const response = await this.repo.findAllAndCount(seller_id)
    return response
  }

  async fineOneProductById<T extends number>({
    seller_id,
    product_id,
  }: {
    seller_id: T
    product_id: T
  }) {
    const response = await this.repo.findOne(
      {
        product_id,
        seller_id,
      },
      ['product']
    )
    return response?.product
  }

  async getSellerProductBySku(sku: string) {
    const { seller_id, isError } = decodedSkuProduct(sku)

    if (!isError) {
      const { userSeller } = await this.repo.findOne(
        { seller_id, product: { sku: Not(IsNull()) } },
        ['userSeller'],
        {
          userSeler: [
            'id',
            'store_name',
            'profile_image',
            'created_at',
            'updated_at',
          ],
        }
      )

      const countProduct = await this.repo.countSellerProduct({ seller_id })

      const data = { ...userSeller, product_list_count: countProduct }

      return success(null, { data })
    } else {
      return error.notccepted('sku invalid')
    }
  }

  async findAllIncluded(filter: FindOptionsWhere<SellerProductEntity>) {
    const response = await this.repo.findAllIncluded(filter)

    return response
  }
}
