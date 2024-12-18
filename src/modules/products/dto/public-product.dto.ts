import { ApiProperty } from '@nestjs/swagger'

export class PublicProductDto {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 'Soap' })
  name!: string

  @ApiProperty({ example: 945, description: 'Price in cents' })
  price!: number

  @ApiProperty({ example: 10 })
  quantityInStock!: number
}
