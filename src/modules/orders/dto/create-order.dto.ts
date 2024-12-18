import { ArrayNotEmpty, IsInt, IsOptional, IsPhoneNumber, IsPositive, IsString, IsUrl, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

class CreateOrderItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  productId!: number
  
  @ApiProperty({ example: 3 })
  @IsInt()
  @IsPositive()
  quantity!: number
}

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  customerId?: number

  @ApiProperty({ type: [CreateOrderItemDto] })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems!: CreateOrderItemDto[]

  @ApiProperty({ example: '123 Maple Avenue, Suite 456, Springfield, IL 62701, USA' })
  @IsString()
  deliveryAddress!: string

  @ApiProperty({ example: '+15551234567' })
  @IsPhoneNumber()
  customerPhone!: string
}

export class CreateCustomerOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto] })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems!: CreateOrderItemDto[]

  @ApiProperty({ example: 'ticket url', description: 'Ticket confirming a payment' })
  @IsUrl()
  paymentTicket!: string

  @ApiProperty({ example: '123 Maple Avenue, Suite 456, Springfield, IL 62701, USA' })
  @IsString()
  deliveryAddress!: string

  @ApiProperty({ example: '+15551234567' })
  @IsPhoneNumber()
  customerPhone!: string
}
