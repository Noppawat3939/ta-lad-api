import { Module } from '@nestjs/common'
import { CoreModule } from './core'
import { ConfigModule } from './config'
import { ExternalModule } from './external'

@Module({
  imports: [ConfigModule, CoreModule, ExternalModule],
  exports: [ConfigModule, CoreModule, ExternalModule],
})
export class AppModule {}
