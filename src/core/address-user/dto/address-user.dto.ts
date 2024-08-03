import { IsNotEmpty } from 'class-validator'

export class CreateAddressUserDto {
  @IsNotEmpty()
  address_card_id: string

  @IsNotEmpty()
  province: string

  @IsNotEmpty()
  district: string

  @IsNotEmpty()
  sub_district: string
}
