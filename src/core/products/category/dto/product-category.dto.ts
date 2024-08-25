import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator'

class ProductCategoryParams {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsString()
  image: string
}

export class InsertProductCategoryDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductCategoryParams)
  data: ProductCategoryParams[]
}
