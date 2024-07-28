import { IsEmail, IsNotEmpty, Length } from 'class-validator'
import { CreateAddressUserDto } from 'src/address-user'

export class CreateUserDto extends CreateAddressUserDto {
  @IsNotEmpty()
  first_name: string

  @IsNotEmpty()
  last_name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string

  @Length(13)
  @IsNotEmpty()
  id_card: string
}
