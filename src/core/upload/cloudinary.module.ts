import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CloudinaryProvider } from './cloudinary.config'
import { UploadController } from './cloudinary.controller'
import { CloudinaryService } from './cloudinary.service'

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
