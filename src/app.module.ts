import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { User, UserModule } from './user'
import { AddressUser, AddressUserModule } from './address-user'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      synchronize: true,
      // entities: [User, AddressUser],
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UserModule,
    AddressUserModule,
  ],
})
export class AppModule {}
