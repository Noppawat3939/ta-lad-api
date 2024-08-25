import { Controller, Post, UploadedFile } from '@nestjs/common'
import { CloudinaryService } from './cloudinary.service'
import { UseFileInterceptor } from 'src/decorator/file-interceptor'
import { SkipThrottle } from '@nestjs/throttler'

@Controller('upload')
export class UploadController {
  constructor(private readonly service: CloudinaryService) {}

  @SkipThrottle()
  @Post()
  @UseFileInterceptor()
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(123, file)
    return this.service.uploadImage(file)
  }
}
