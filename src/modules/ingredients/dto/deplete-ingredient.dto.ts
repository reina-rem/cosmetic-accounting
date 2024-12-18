import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class DepleteIngredientDto {
  @ApiProperty({ 
    example: 2, 
    description: 'The number indicating how many packages of the ingredient to deplete from stock'
  })
  @IsInt()
  @IsPositive()
  quantityDelta!: number
}
