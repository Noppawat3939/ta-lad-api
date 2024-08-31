import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator'
import { IsNotEmptyString } from 'src/decorator'

class ProductParams {
  @IsNotEmptyString({ message: 'product_name is requiured' })
  @MinLength(1)
  product_name: string

  @IsNotEmptyString({ message: 'category_name is required' })
  @MinLength(1)
  category_name: string

  @IsNotEmptyString({ message: 'brand is required' })
  @MinLength(1)
  brand: string

  @IsOptional()
  product_image?: string[]

  @IsNotEmpty({ message: 'price is required' })
  @IsNumber()
  @Min(0)
  price: number

  @IsOptional()
  @MaxLength(200)
  description?: string

  @IsOptional()
  @IsNumber()
  stock_amount?: number

  @IsOptional()
  @IsNumber()
  discount_percent?: number

  @IsOptional()
  @IsNumber()
  discount_price?: number

  @IsOptional()
  @IsString()
  discount_start_date?: string

  @IsOptional()
  @IsString()
  discount_end_date?: string
}

export class InsertProdutDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductParams)
  data: ProductParams[]
}
