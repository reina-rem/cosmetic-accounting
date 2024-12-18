import { ApiProperty } from '@nestjs/swagger'
import { SafeUserDto } from '../../users/dto/safe-user.dto'

export class FullCustomerInfoDto {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 'Sam Smith' })
  name!: string

  @ApiProperty({ example: '2024-01-30' })
  birthday!: string

  @ApiProperty({ example: 'Male, 30 y.o.' })
  note!: string
  
  @ApiProperty({ type: SafeUserDto })
  user!: SafeUserDto
}
