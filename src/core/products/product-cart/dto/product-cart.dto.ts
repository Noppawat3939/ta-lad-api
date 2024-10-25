import { IsNotEmpty, IsNumber } from 'class-validator'

export class InsertProductCartDto {
  @IsNumber()
  product_id: number

  @IsNotEmpty({ message: 'price is required' })
  @IsNumber()
  amount: number
}
