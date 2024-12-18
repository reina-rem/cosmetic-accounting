import { ApiProperty } from '@nestjs/swagger'
import { IsPositive, IsString } from 'class-validator'

export class CreatePackageDto {
  @ApiProperty({ example: 'Box' })
  @IsString()
  name!: string

  @ApiProperty({ example: 945, description: 'Price in cents' })
  @IsPositive()
  price!: number
}
