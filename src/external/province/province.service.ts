import { Injectable } from '@nestjs/common'
import { getDistrict, getProvinces, getSubDistrict } from './https'
import { error, success } from 'src/lib'
import { District, Province, SubDistrict } from 'src/types'

@Injectable()
export class ProvinceService {
  constructor() {}

  async getProvinceData(dto?: {
    search?: 'district' | 'sub_district'
    province_id?: number
    district_id?: number
  }) {
    let result: unknown[]
    let promise: Promise<(Province & District & SubDistrict)[]>

    if (
      (dto.search === 'district' && !dto.province_id) ||
      (dto.search === 'sub_district' && !dto.district_id)
    )
      return error.badrequest('body invalid')

    if (dto.search === 'district') {
      promise = getDistrict()
    } else if (dto.search === 'sub_district') {
      promise = getSubDistrict()
    } else {
      promise = getProvinces()
    }

    const res = await promise

    if (dto.search) {
      const v: (District & SubDistrict)[] = res

      const searchKey = dto.search === 'district' ? 'province_id' : 'amphure_id'

      result = v
        .filter((item) => item[searchKey] === item[searchKey])
        .map((item) => ({
          id: item.id,
          name_en: item.name_en,
          name_th: item.name_th,
          ...(searchKey === 'amphure_id' && { zip_code: item.zip_code }),
        }))
    } else {
      const p: Province[] = res

      result = p.map((item) => ({
        id: item.id,
        name_en: item.name_en,
        name_th: item.name_th,
      }))
    }

    return success(null, { data: result })
  }
}
