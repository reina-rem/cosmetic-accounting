import { IsISO8601 } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateOrderDeliveryDateDto {
  @ApiProperty({ example: '2024-01-30' })
  @IsISO8601()
  deliveryDate!: string
}
