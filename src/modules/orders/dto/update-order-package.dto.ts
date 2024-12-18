import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class UpdateOrderPackageDto {
  @ApiProperty({ example: 1, description: 'Id of the package to associate with the order' })
  @IsInt()
  @IsPositive()
  packageId!: number
}
