import { Injectable } from '@nestjs/common'
import {
  ValidateEmailDto,
  ValidateIdNumberDto,
  ValidatePhoneNumberDto,
} from './dto'
import { error, hashCrypto, success, validIdNumber } from 'src/lib'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities'
import { FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async validationField(
    dto: ValidatePhoneNumberDto & ValidateEmailDto & ValidateIdNumberDto
  ) {
    let message: string | null
    let filter: FindOptionsWhere<User>
    let response = { available: false }

    if (Object.values(dto).length > 1) return error.badrequest('body invalid')

    const { phone_number, email, identity_number } = dto

    if (phone_number) {
      filter = { phone_number }
    }
    if (email) {
      filter = { email }
    }
    if (identity_number) {
      const isValidIdNumber = validIdNumber(identity_number)
      const hashedIdNumber = hashCrypto(identity_number)

      if (!isValidIdNumber)
        return success('id_card invalid', { available: false })

      filter = { id_card: hashedIdNumber }
    }

    const user = await this.userRepo.findOne({ where: filter })

    if (user) {
      message = `${Object.keys(filter).at(0)} already exits`
      response.available = false
    } else {
      message = null
      response.available = true
    }

    return success(message, response)
  }
}
