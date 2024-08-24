import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { PassportModule } from '@nestjs/passport'

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
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
  exports: [NestConfigModule, JwtModule, TypeOrmModule, MailerModule],
})
export class ConfigModule {}
