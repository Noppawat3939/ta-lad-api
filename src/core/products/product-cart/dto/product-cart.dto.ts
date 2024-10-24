import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class InsertProductCartDto {
  @IsNumber()
  product_id: number

  @IsNotEmpty({ message: 'price is required' })
  @IsNumber()
  @Min(1, { message: 'amount should be minimum 1' })
  amount: number
}
