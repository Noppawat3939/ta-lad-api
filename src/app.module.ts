import { Module } from '@nestjs/common'
import { CoreModule } from './core'
import { ConfigModule } from './config'

@Module({
  imports: [ConfigModule, CoreModule],
  exports: [ConfigModule, CoreModule],
})
export class AppModule {}
