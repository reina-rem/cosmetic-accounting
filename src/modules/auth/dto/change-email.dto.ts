import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class ChangeEmailDto {
  @ApiProperty({ example: 'sam.smith@gmail.com' })
  @IsEmail()
  oldEmail!: string

  @ApiProperty({ example: 'sam@gmail.com' })
  @IsEmail()
  newEmail!: string

  @ApiProperty({ example: 'asdf1234' })
  @IsString()
  password!: string
}
