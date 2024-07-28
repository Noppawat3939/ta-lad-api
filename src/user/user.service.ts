import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/user.dto'
import { UserRole } from './enum/user-role.enum'
import { AddressUser } from 'src/address-user'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(AddressUser)
    private addressRepository: Repository<AddressUser>
  ) {}

  async createUser(dto: CreateUserDto) {
    const userParams = {
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      password: dto.password,
      role: UserRole.USER,
      id_card: dto.id_card,
    }

    const newUser = await this.userRepository.save(userParams)

    if (newUser.id) {
      const addressUserParmas = {
        address_card_id: dto.address_card_id,
        province: dto.province,
        district: dto.district,
        sub_district: dto.sub_district,
        user_id: newUser.id,
      }

      await this.addressRepository.save(addressUserParmas)

      return { success: true }
    }
  }
}
