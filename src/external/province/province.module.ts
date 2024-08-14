import { Module } from '@nestjs/common'
import { ProvinceController } from './province.controller'
import { ProvinceService } from './province.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    HttpModule.register({
      method: 'GET,POST',
      timeout: 30000,
    }),
  ],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
