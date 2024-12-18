import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator'

export class UpdateEmployeeInfoDto {
  @ApiProperty({ example: 'Sam Smith' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: 250000 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  salary?: number
}
