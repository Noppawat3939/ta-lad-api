import { UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

const MAX_FILE_SIZE = 1024 * 1024 * 5 //5MB
const RegexFileType = /\/(jpg|jpeg|png|gif)$/

export const UseFileInterceptor = () =>
  UseInterceptors(
    FileInterceptor('file', {
      limits: { fieldSize: MAX_FILE_SIZE },
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(RegexFileType)) {
          return cb(new Error('Only image files are allowed'), false)
        }
        cb(null, true)
      },
    })
  )
