import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ChangePasswordDto {
  @ApiProperty({ example: 'asdf1234' })
  @IsString()
  oldPassword!: string

  @ApiProperty({ example: 'qwer4321' })
  @IsString()
  newPassword!: string
}
