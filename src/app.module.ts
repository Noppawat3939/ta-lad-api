import { Module } from '@nestjs/common'
import { CoreModule } from './core'
import { ConfigModule } from './config'
import { ExternalModule } from './external'
import { CloudinaryModule } from './core/upload'

@Module({
  imports: [ConfigModule, CoreModule, ExternalModule, CloudinaryModule],
  exports: [ConfigModule, CoreModule, ExternalModule, CloudinaryModule],
})
export class AppModule {}
