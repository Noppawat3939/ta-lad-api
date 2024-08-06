import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRED ?? '1d',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      synchronize: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: +process.env.MAILER_PORT,
        secure: process.env.MAILER_SECURE,
        auth: { user: process.env.MAILER_USER, pass: process.env.MAILER_PASS },
      },
    }),
  ],
  exports: [JwtModule, NestConfigModule, TypeOrmModule, MailerModule],
})
export class ConfigModule {}
