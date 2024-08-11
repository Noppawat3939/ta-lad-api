import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ProvinceService } from './province.service'
import { SkipThrottle } from '@nestjs/throttler'
import { HttpStatusCode } from 'axios'
import { ExternalGuard } from 'src/guards'

@UseGuards(ExternalGuard)
@Controller('province')
export class ProvinceController {
  constructor(private readonly service: ProvinceService) {}

  @SkipThrottle()
  @HttpCode(HttpStatusCode.Ok)
  @Post()
  getProvince(
    @Body()
    dto: {
      search?: 'district' | 'sub_district'
      province_id?: number
      district_id?: number
    }
  ) {
    return this.service.getProvinceData(dto)
  }
}
