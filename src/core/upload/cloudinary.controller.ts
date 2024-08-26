import { Controller, Post, UploadedFile, UseGuards } from '@nestjs/common'
import { CloudinaryService } from './cloudinary.service'
import { UseFileInterceptor } from 'src/decorator/file-interceptor'
import { SkipThrottle } from '@nestjs/throttler'
import { PrivateKeyGuard } from 'src/guards'

@UseGuards(PrivateKeyGuard)
@Controller('upload')
export class CloudinaryController {
  constructor(private service: CloudinaryService) {}

  @SkipThrottle()
  @UseFileInterceptor()
  @Post()
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(file)
  }
}
