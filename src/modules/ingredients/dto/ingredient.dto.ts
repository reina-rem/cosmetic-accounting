import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive, IsString, Min } from 'class-validator'
import { IngredientUnit } from '../ingredients.types'
import { ProductDto } from '../../products/dto/product.dto'

export class IngredientDto {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 'Water' })
  @IsString()
  name!: string

  @ApiProperty({ example: 945, description: 'Price in cents' })
  @IsInt()
  @IsPositive()
  pricePerPackage!: number

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  packagesInStock!: number

  @ApiProperty({ example: 5, description: 'Amount of ingredient in one package' })
  @IsInt()
  @IsPositive()
  quantityPerPackage!: number

  @ApiProperty({ example: 'l', description: 'Units of measurement for quantity per package' })
  @IsString()
  unit!: IngredientUnit

  @ApiProperty({ type: [ProductDto], description: 'Products associated with the ingredient' })
  products!: ProductDto[]
}
