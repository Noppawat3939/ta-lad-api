import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { UserModule } from './user'
import { ProductsModule } from './products'
import { CloudinaryModule } from './upload'
import { HealthModule } from './health'

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductsModule,
    CloudinaryModule,
    HealthModule,
  ],
})
export class CoreModule {}
