import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class DepleteProductDto {
  @ApiProperty({ 
    example: 2, 
    description: 'The number indicating how many units of the product to deplete from stock'
  })
  @IsInt()
  @IsPositive()
  quantityDelta!: number
}
