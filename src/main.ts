import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: 'Content-Type,Authorization,Locale,Api-Key',
  })
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT, () => console.log('🌐 Server started'))
}
bootstrap()
