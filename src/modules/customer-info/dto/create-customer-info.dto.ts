import { ApiProperty } from '@nestjs/swagger'
import { IsISO8601, IsInt, IsPositive, IsString } from 'class-validator'

export class CreateCustomerInfoDto {
  @ApiProperty({ example: 'Sam Smith' })
  @IsString()
  name!: string

  @ApiProperty({ example: '2024-01-30' })
  @IsISO8601()
  birthday!: string

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  userId!: number
}
