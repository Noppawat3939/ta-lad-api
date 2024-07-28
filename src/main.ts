import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors({ origin: [process.env.LOCAL_ORIGIN] })

  await app.listen(process.env.PORT, () => console.log('🌐 Server started'))
}
bootstrap()
