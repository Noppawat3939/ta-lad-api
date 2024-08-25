import { Injectable, Inject } from '@nestjs/common'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { UploadApiErrorResponse } from 'cloudinary'

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('Cloudinary') private readonly cloudinaryInstance: typeof cloudinary
  ) {}

  async uploadImage(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      this.cloudinaryInstance.uploader
        .upload_stream({ folder: 'product_images' }, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
        .end(file.buffer)
    })
  }
}
