import { ApiProperty } from '@nestjs/swagger'
import { SafeUserDto } from '../../users/dto/safe-user.dto'

export class EmployeeInfoDto {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 'Sam Smith' })
  name!: string

  @ApiProperty({ example: 250000 })
  salary!: number

  @ApiProperty({ type: SafeUserDto })
  user!: SafeUserDto | null
}
