import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsPositive, IsString } from 'class-validator'

export class UpdatePackageDto {
  @ApiProperty({ example: 'Box' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: 945, description: 'Price in cents' })
  @IsOptional()
  @IsPositive()
  price?: number
}
