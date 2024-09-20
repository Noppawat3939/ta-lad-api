import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InsertGroupProductsDto } from './dto'
import { GroupProductsRepository } from './repository'
import { SellerProductService } from '../seller-product'
import { error, success } from 'src/lib'
import { In } from 'typeorm'

@Injectable()
export class GroupProductsService {
  constructor(
    private repo: GroupProductsRepository,

    @Inject(forwardRef(() => SellerProductService))
    private sellerProductService: SellerProductService
  ) {}

  async insert(seller_id: number, dto: InsertGroupProductsDto) {
    const productIds = dto.product_ids
    const isInvalidId =
      productIds.length <= 1 ||
      productIds.length !== [...new Set(productIds)].length

    if (isInvalidId) {
      return error.badrequest('id invalid')
    }

    for (const productId of productIds) {
      const sellerProduct = await this.sellerProductService.findAllIncluded(
        {
          product_id: productId,
          seller_id,
        },
        ['userSeller']
      )

      if (sellerProduct.length === 0) {
        return error.notccepted('product not found', {
          error_message: 'ไม่พบสินค้าที่ต้องการจัดกลุ่ม',
        })
      }
    }

    const groupProducts = await this.repo.findAll({ seller_id })

    if (groupProducts.length > 0) {
      const groupedProductIds = groupProducts.flatMap(
        (item) => item.product_ids
      )

      const hasDuplicatedId = groupedProductIds.some((id) =>
        dto.product_ids.includes(id)
      )

      if (hasDuplicatedId) {
        return error.notccepted('some ids have already been grouped together', {
          error_message: 'บาง id มีการจัดกลุ่มแล้ว',
        })
      }
    }

    const createParams = { seller_id, ...dto }

    const data = await this.repo.create(createParams)

    if (data?.id) {
      await this.sellerProductService.update(
        { seller_id, product_id: In(productIds) },
        { group_product_id: data.id }
      )
    }

    return success('inserted success')
  }

  async unGroup(seller_id: number, id: number | number[]) {
    if (!id) return error.badrequest()

    const grouppedProducts = await this.repo.findAll({
      id: Array.isArray(id) ? In(id) : id,
      seller_id,
    })

    if (grouppedProducts.length > 0) {
      for (const grouppedItem of grouppedProducts) {
        await this.sellerProductService.update(
          {
            product_id: In(grouppedItem.product_ids),
            seller_id: grouppedItem.seller_id,
          },
          { group_product_id: null }
        )
      }

      const groupProductIds = grouppedProducts.map((item) => item.id)
      await this.repo.delete({ id: In(groupProductIds) })
    }

    return success('updated group product')
  }
}
