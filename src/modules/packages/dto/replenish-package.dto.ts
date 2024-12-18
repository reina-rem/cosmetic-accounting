import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class ReplenishPackageDto {
  @ApiProperty({ 
    example: 2, 
    description: 'The number indicating how many packages to replenish in stock'
  })
  @IsInt()
  @IsPositive()
  quantityDelta!: number
}
