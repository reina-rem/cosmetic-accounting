import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../users.types'

export class SafeUserDto {
  @ApiProperty({ example: 1 })
  id!: number
  
  @ApiProperty({ example: ['courier', 'manufacturer', 'customer'] })
  roles!: UserRole[]

  @ApiProperty({ example: 'sam.smith@gmail.com' })
  email!: string
}
