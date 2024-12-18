import { ApiProperty } from '@nestjs/swagger'

export class CustomerInfoDto {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 'Sam Smith' })
  name!: string

  @ApiProperty({ example: '2024-01-30' })
  birthday!: string
}
