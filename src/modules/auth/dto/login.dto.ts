import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'sam.smith@gmail.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 'asdf1234' })
  @IsString()
  password!: string
}
