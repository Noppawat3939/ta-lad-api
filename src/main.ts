import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ValidateBadReqExceptionFilter } from './exception-filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors({
    origin: [process.env.LOCAL_ORIGIN],
    methods: ['GET', 'POST'],
    allowedHeaders: 'Content-Type,Authorization,Locale,Api-Key',
  })
  app.useGlobalFilters(new ValidateBadReqExceptionFilter())
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT, () =>
    console.log(`🌐 Server started in ${process.env.PORT}`)
  )
}
bootstrap()
