import { ApiProperty } from '@nestjs/swagger'
import { UserRole, userRoles } from '../../../entities/user.entity'
import { arrayUnique, IsArray, IsEmail, IsIn, Validate } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'sam.smith@gmail.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: ['courier', 'manufacturer', 'customer'] })
  @IsArray()
  @IsIn(userRoles)
  @Validate(arrayUnique)
  roles!: UserRole[]
}
