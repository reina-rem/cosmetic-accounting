import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class ResetPasswordDto {
  @ApiProperty({ example: 'sam.smith@gmail.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 'secret key' })
  @IsString()
  passwordKey!: string

  @ApiProperty({ example: 'asdf1234' })
  @IsString()
  password!: string
}
