import { Injectable } from '@nestjs/common'
import { ValidateIdNumberDto } from './dto'
import { hashCrypto, success, validIdNumber } from 'src/lib'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async validationIdentityNumber(dto: ValidateIdNumberDto) {
    const isValid = validIdNumber(dto.identity_number)

    const hashedIdCard = hashCrypto(dto.identity_number)

    const data = await this.userRepo.findOne({
      where: { id_card: hashedIdCard },
    })

    if (data) return success('id_card is already exits', { result: false })

    return success(null, { result: isValid })
  }
}
