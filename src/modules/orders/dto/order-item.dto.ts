import { ApiProperty } from '@nestjs/swagger'
import { ProductDto } from '../../products/dto/product.dto'

export class OrderItemDto {
  @ApiProperty({ example: 1 })
  id!: number
  
  @ApiProperty({ type: ProductDto })
  product!: ProductDto

  @ApiProperty({ example: 2 })
  quantity!: number

  @ApiProperty({ example: 945, description: 'Price in cents' })
  price!: number
}
