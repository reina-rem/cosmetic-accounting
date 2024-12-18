import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class ReplenishProductDto {
  @ApiProperty({ 
    example: 2, 
    description: 'The number indicating how many units of the product to replenish in stock'
  })
  @IsInt()
  @IsPositive()
  quantityDelta!: number
}
