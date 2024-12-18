import { IsIn, IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator'
import { IngredientUnit, ingredientUnits } from '../../../entities/ingredient.entity'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateIngredientInfoDto {
  @ApiProperty({ example: 'Water' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: 945, description: 'Price in cents' })
  @IsOptional()
  @IsPositive()
  pricePerPackage?: number

  @ApiProperty({ example: 5, description: 'Amount of ingredient in one package' })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantityPerPackage?: number

  @ApiProperty({ example: 'l', description: 'Units of measurement for quantity per package' })
  @IsOptional()
  @IsIn(ingredientUnits)
  unit?: IngredientUnit
}
