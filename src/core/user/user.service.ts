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
    let response = { available: false, field: '', error_message: '' }

    if (Object.values(dto).length > 1 || Object.values(dto).length === 0)
      return error.badrequest('body invalid')

    const { phone_number, email, id_card } = dto

    if (phone_number) {
      filter = { phone_number }
    }
    if (email) {
      filter = { email }
    }
    if (id_card) {
      const isValidIdNumber = validIdNumber(id_card)
      const hashedIdNumber = hashCrypto(id_card)

      if (!isValidIdNumber)
        return success('id_card invalid', {
          available: false,
          field: 'id_card',
          error_message: 'เลขบัตรประชาชนไม่ถูกต้อง',
        })

      filter = { id_card: hashedIdNumber }
    }

    const user = await this.userRepo.findOne({
      where: filter,
      select: { id: true },
    })

    if (user) {
      const [field] = Object.keys(filter)
      message = `${Object.keys(filter).at(0)} already exits`
      response.available = false
      response.field = field
      response.error_message =
        field === 'email'
          ? 'มีผู้ใช้อีเมลล์นี้แล้ว'
          : field === 'phone_number'
            ? 'มีผู้ใช้เบอร์โทรศัพท์นี้แล้ว'
            : 'มีผู้ใช้เลขบัตรประชาชนนี้แล้ว'
    } else {
      message = null
      response.available = true
      response.error_message = ''
    }

    return success(message, response)
  }
}
