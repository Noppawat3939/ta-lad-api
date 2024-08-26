import { UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

const MAX_FILE_SIZE = 1024 * 1024 * 3 //3MB
const RegexFileType = /\/(jpg|jpeg|png|gif)$/

export const UseFileInterceptor = () =>
  UseInterceptors(
    FileInterceptor('image', {
      limits: { fieldSize: MAX_FILE_SIZE },
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(RegexFileType)) {
          return cb(new Error('Only image files are allowed'), false)
        }
        cb(null, true)
      },
    })
  )
