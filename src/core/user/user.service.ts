import { Injectable } from '@nestjs/common'
import {
  ValidateEmailDto,
  ValidateIdNumberDto,
  ValidatePhoneNumberDto,
  ValidateStoreNameDto,
} from './dto'
import { error, hashCrypto, success, validIdNumber } from 'src/lib'
import { UserEntity, UserSellerEntity } from './entities'
import { FindOptionsWhere } from 'typeorm'
import { UserRepository, UserSellerRepository } from './repository'

type ValidationFieldsDto = ValidatePhoneNumberDto &
  ValidateEmailDto &
  ValidateIdNumberDto &
  ValidateStoreNameDto

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private userSellerRepo: UserSellerRepository
  ) {}

  async validationField(dto: ValidationFieldsDto, checkStore = false) {
    let message: string | null
    let filter: FindOptionsWhere<UserEntity | UserSellerEntity>
    let response = { available: false, field: '', error_message: '' }

    if (Object.values(dto).length !== 1) return error.badrequest('body invalid')

    const { phone_number, email, id_card, store_name } = dto

    let repository: typeof this.userSellerRepo | typeof this.userRepo

    if (phone_number) {
      filter = { phone_number }
    }
    if (email) {
      filter = { email }
    }
    if (store_name) {
      filter = { store_name }
    }
    if (checkStore) {
      repository = this.userSellerRepo
    }
    if (!checkStore) {
      repository = this.userRepo
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
    } else if (store_name) {
      const store = await this.userSellerRepo.findOne(
        {
          store_name,
        },
        ['store_name']
      )

      if (store) {
        const [field] = Object.keys(filter)

        message = `${field} already exits`
        response.available = false
        response.field = field
        response.error_message = `${store} already exits`
      }
    } else if (email || phone_number) {
      const user = await repository.findOne(filter, ['id'])

      if (user) {
        const [field] = Object.keys(filter)

        message = `${field} already exits`
        response.available = false
        response.field = field
        response.error_message =
          field === 'email'
            ? 'มีผู้ใช้อีเมลล์นี้แล้ว'
            : field === 'phone_number'
              ? 'มีผู้ใช้เบอร์โทรศัพท์นี้แล้ว'
              : 'มีผู้ใช้เลขบัตรประชาชนนี้แล้ว'
      }
    } else {
      message = null
      response.available = true
      response.error_message = ''
    }

    return success(message, response)
  }
}
