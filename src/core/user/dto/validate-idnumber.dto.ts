import { IsNotEmpty, Length, Matches, MaxLength } from 'class-validator'
import { regex } from 'src/lib'

export class ValidateIdNumberDto {
  @IsNotEmpty()
  @Length(13)
  @MaxLength(13)
  @Matches(regex.number, { message: 'Pattern must be 0-9 only' })
  identity_number: string
}