import { Controller, Get } from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'
import { HealthService } from './health.service'

@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get()
  checkDB() {
    return this.service.check()
  }
}
