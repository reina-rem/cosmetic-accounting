import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class ReplenishIngredientDto {
  @ApiProperty({ 
    example: 2, 
    description: 'The number indicating how many packages of the ingredient to replenish in stock'
  })
  @IsInt()
  @IsPositive()
  quantityDelta!: number
}
