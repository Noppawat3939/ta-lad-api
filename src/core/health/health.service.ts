import { Injectable } from '@nestjs/common'
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private http: HttpHealthIndicator
  ) {}

  check() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 5000 }),
    ])
  }
}
