import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
} from 'class-validator'
import { regex } from 'src/lib'

export class ValidateIdNumberDto {
  @IsNotEmpty()
  @Length(13)
  @MaxLength(13)
  @Matches(regex.number, { message: 'Pattern must be 0-9 only' })
  id_card: string
}

export class ValidateEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class ValidatePhoneNumberDto {
  @IsNotEmpty()
  phone_number: string
}
