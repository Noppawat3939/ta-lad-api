import { Injectable } from '@nestjs/common'
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary'
import * as streamifier from 'streamifier'

@Injectable()
export class CloudinaryService {
  constructor() {}

  async uploadImage(file: Express.Multer.File) {
    return new Promise<UploadApiErrorResponse | UploadApiResponse>(
      (resolve, reject) => {
        const destination = cloudinary.uploader.upload_stream(
          { folder: 'talad_products' },
          (err, result) => {
            if (err) {
              console.log('upload image', err)
              reject(err)
            }

            resolve(result)
          }
        )
        streamifier.createReadStream(file.buffer).pipe(destination)
      }
    )
  }
}
