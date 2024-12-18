import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class DepletePackageDto {
  @ApiProperty({ 
    example: 2, 
    description: 'The number indicating how many packages to deplete from stock'
  })
  @IsInt()
  @IsPositive()
  quantityDelta!: number
}
