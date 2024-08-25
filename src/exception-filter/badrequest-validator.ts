import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common'
import { Nullable } from 'src/types'

@Catch(BadRequestException)
export class ValidateBadReqExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const res = context.getResponse()
    const status = exception.getStatus()

    const exceptionRes = exception.getResponse() as {
      message?: Nullable<string[] | string>
      error?: object
    }

    const message =
      Array.isArray(exceptionRes?.message) &&
      exceptionRes.message?.map((msg: string) =>
        msg?.replace(/data\.\d+\./, '')
      )

    res.status(status).json({
      statusCode: status,
      message,
      error: exceptionRes.error,
    })
  }
}
