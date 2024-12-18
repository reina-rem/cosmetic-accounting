import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsOptional, IsPositive, IsString } from 'class-validator'

export class UpdateProductInfoDto {
  @ApiProperty({ example: 'Soap' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: 945, description: 'Price in cents' })
  @IsOptional()
  @IsPositive()
  price?: number

  @ApiProperty({ example: 'This could be any recipe for making a product' })
  @IsOptional()
  @IsString()
  recipe?: string

  @ApiProperty({ example: [1, 4, 5], description: 'Ids of ingredients associated with the product' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  ingredientsIds?: number[]
}
