import { ApiProperty } from '@nestjs/swagger'
import { IsISO8601, IsIn, IsInt, IsPhoneNumber, IsPositive, IsString, IsUrl } from 'class-validator'
import { OrderStatus, orderStatuses } from '../../../entities/order.entity'
import { User } from '../../../entities/user.entity'
import { OrderItemDto } from './order-item.dto'
import { PackageDto } from '../../packages/dto/package.dto'

export class FullOrderDto {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ type: User })
  customer!: User | null

  @ApiProperty({ type: [OrderItemDto] })
  items!: OrderItemDto[]

  @ApiProperty({ type: PackageDto })
  package!: PackageDto | null

  @ApiProperty({ example: 945, description: 'Price in cents' })
  @IsInt()
  @IsPositive()
  totalPrice!: number

  @ApiProperty({ example: 'ticket url', description: 'Ticket confirming a payment' })
  @IsUrl()
  paymentTicket!: string | null

  @ApiProperty({ example: 'ready' })
  @IsIn(orderStatuses)
  status!: OrderStatus

  @ApiProperty({ example: '2024-01-30' })
  @IsISO8601()
  deliveryDate!: string | null

  @ApiProperty({ example: '123 Maple Avenue, Suite 456, Springfield, IL 62701, USA' })
  @IsString()
  deliveryAddress!: string

  @ApiProperty({ example: '+15551234567' })
  @IsPhoneNumber()
  customerPhone!: string

  @ApiProperty({ example: '2024-01-30T00:00:00Z' })
  createdAt!: Date

  @ApiProperty({ example: '2024-01-30T00:30:00Z' })
  updatedAt!: Date
}
