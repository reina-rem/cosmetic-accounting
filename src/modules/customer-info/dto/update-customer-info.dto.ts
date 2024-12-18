import { ApiProperty } from '@nestjs/swagger'
import { IsISO8601, IsOptional, IsString } from 'class-validator'

export class UpdateCustomerInfoDto {
  @ApiProperty({ example: 'Sam Smith' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: '2024-01-30' })
  @IsOptional()
  @IsISO8601()
  birthday?: string
}
