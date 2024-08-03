import { Injectable } from '@nestjs/common'
import { ValidateEmailDto, ValidateIdNumberDto } from './dto'
import { hashCrypto, success, validIdNumber } from 'src/lib'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async validationIdentityNumber(dto: ValidateIdNumberDto) {
    const isValid = validIdNumber(dto.identity_number)

    const id_card = hashCrypto(dto.identity_number)

    const data = await this.userRepo.findOne({ where: { id_card } })

    if (data) return success('user already exits', { result: false })

    return success(null, { result: isValid })
  }

  async validationEmail({ email }: ValidateEmailDto) {
    const userEmail = await this.userRepo.findOne({ where: { email } })

    if (userEmail) return success('email already exits', { result: false })

    return success(null, { result: true })
  }
}
