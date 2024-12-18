import { ApiProperty } from '@nestjs/swagger'
import { IsISO8601, IsEmail, IsString } from 'class-validator'

export class RegistrateCustomerAccountDto {
  @ApiProperty({ example: 'Sam Smith' })
  @IsString()
  name!: string

  @ApiProperty({ example: 'sam.smith@gmail.com' })
  @IsString()
  @IsEmail()
  email!: string

  @ApiProperty({ example: '2024-01-30' })
  @IsISO8601()
  birthday!: string
}
