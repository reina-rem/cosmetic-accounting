import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive, IsString } from 'class-validator'

export class CreateEmployeeInfoDto {
  @ApiProperty({ example: 'Sam Smith' })
  @IsString()
  name!: string

  @ApiProperty({ example: 250000 })
  @IsInt()
  @IsPositive()
  salary!: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  userId!: number
}
