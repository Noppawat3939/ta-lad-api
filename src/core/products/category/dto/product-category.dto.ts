import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

class ProductCategoryParams {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsString()
  image: string
}

export class InsertProductCategoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductCategoryParams)
  data: ProductCategoryParams[]
}
