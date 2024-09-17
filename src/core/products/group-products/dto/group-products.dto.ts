import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { IsNotEmptyString } from 'src/decorator'

export class InsertGroupProductsDto {
  @IsNotEmptyString({ message: 'name is required' })
  @MinLength(1)
  name: string

  @IsArray()
  @ArrayNotEmpty()
  product_ids: number[]
}

export class UpdateGroupProductsDto {
  @IsString()
  @IsOptional()
  name: string

  @IsOptional()
  @IsArray()
  product_ids: number[]
}
