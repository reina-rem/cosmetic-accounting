import { IsIn, IsInt, IsPositive, IsString, Min } from 'class-validator'
import { IngredientUnit, ingredientUnits } from '../../../entities/ingredient.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateIngredientDto {
  @ApiProperty({ example: 'Water' })
  @IsString()
  name!: string

  @ApiProperty({ example: 945, description: 'Price in cents' })
  @IsPositive()
  pricePerPackage!: number

  @ApiProperty({ example: 5, description: 'Amount of ingredient in one package' })
  @IsInt()
  @IsPositive()
  quantityPerPackage!: number

  @ApiProperty({ example: 'l', description: 'Units of measurement for quantity per package' })
  @IsIn(ingredientUnits)
  unit!: IngredientUnit
}
