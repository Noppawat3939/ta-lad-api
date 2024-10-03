import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
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
  product_images?: { image: string; is_main: boolean }[]

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

  @IsNumber()
  @IsOptional()
  discount_percent?: number

  @IsNumber()
  @IsOptional()
  discount_price?: number

  @IsString()
  @IsOptional()
  discount_start_date?: string

  @IsOptional()
  @IsString()
  discount_end_date?: string

  @IsOptional()
  @IsBoolean()
  is_preorder?: boolean

  @IsString()
  @IsNotEmpty({ message: 'provider is required' })
  @MinLength(1)
  provider: string

  @IsNumber()
  @IsNotEmpty({ message: 'delivery_time is required' })
  @Min(1)
  delivery_time: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  shipping_fee: number
}

export class InsertProdutDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductParams)
  data: ProductParams[]
}
