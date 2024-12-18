import { ApiProperty } from '@nestjs/swagger'
import { arrayUnique, IsArray, IsIn, Validate } from 'class-validator'
import { UserRole, userRoles } from '../../../entities/user.entity'

export class UpdateUserRolesDto {
  @ApiProperty({ example: ['courier', 'manufacturer', 'customer'] })
  @IsArray()
  @IsIn(userRoles, { each: true })
  @Validate(arrayUnique)
  roles!: UserRole[]
}
