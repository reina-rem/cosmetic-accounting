import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator'

export class CreateProductDto {
  @ApiProperty({ example: 'Soap' })
  @IsString()
  name!: string

  @ApiProperty({ example: 945, description: 'Price in cents' })
  @IsPositive()
  price!: number

  @ApiProperty({ example: [1, 4, 5], description: 'Ids of ingredients associated with the product' })
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  ingredientsIds!: number[]

  @ApiProperty({ example: 'This could be any recipe for making a product' })
  @IsOptional()
  @IsString()
  recipe!: string
}
