import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../../users/users.types'

export class UserInfoDto {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: ['courier', 'manufacturer'] })
  roles!: UserRole[]

  @ApiProperty({ example: 'token' })
  token!: string
}
