import { Module } from '@nestjs/common'
import { ProvinceModule } from './province'

@Module({
  imports: [ProvinceModule],
})
export class ExternalModule {}
