import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductShippingEntity } from './entities'
import { ProductShippingRepository } from './repository'
import { ProductShippingService } from './product-shipping.service'
import { ProductShippingController } from './product-shipping.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ProductShippingEntity])],
  controllers: [ProductShippingController],
  providers: [ProductShippingRepository, ProductShippingService],
})
export class ProductShippingModule {}
