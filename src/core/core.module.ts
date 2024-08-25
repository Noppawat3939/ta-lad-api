import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { UserModule } from './user'
import { ProductsModule } from './products'
import { CloudinaryModule } from './upload'

@Module({
  imports: [AuthModule, UserModule, ProductsModule],
})
export class CoreModule {}
