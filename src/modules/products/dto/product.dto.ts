import { ApiProperty } from '@nestjs/swagger'

export class ProductDto {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 'Soap' })
  name!: string

  @ApiProperty({ example: 945, description: 'Price in cents' })
  price!: number

  @ApiProperty({ example: 10 })
  quantityInStock!: number

  @ApiProperty({ example: 2, description: 'The number of products within orders with a pending status' })
  quantityReserved!: number

  @ApiProperty({ example: 'This could be any recipe for making a product' })
  recipe!: string
}
