import { Controller, Get } from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'
import { HealthService } from './health.service'

@Controller('health')
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @SkipThrottle()
  @Get()
  checkDB() {
    return this.service.check()
  }
}
