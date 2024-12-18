import { ApiProperty } from '@nestjs/swagger'
import { arrayUnique, IsArray, IsEmail, IsIn, IsInt, IsPositive, IsString, Validate } from 'class-validator'
import { UserRole, userRoles } from '../../../entities/user.entity'

export class CreateEmployeeAccountDto {
  @ApiProperty({ example: 'sam.smith@gmail.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: ['courier', 'manufacturer'] })
  @IsArray()
  @IsIn(
    userRoles.filter(role => role !== 'customer'), 
    { each: true }
  )
  @Validate(arrayUnique)
  roles!: UserRole[]

  @ApiProperty({ example: 'Sam Smith' })
  @IsString()
  name!: string

  @ApiProperty({ example: 250000 })
  @IsInt()
  @IsPositive()
  salary!: number
}
