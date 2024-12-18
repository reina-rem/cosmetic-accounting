import { ApiProperty } from '@nestjs/swagger'
import { IsUrl } from 'class-validator'

export class UpdateOrderTicketDto {
  @ApiProperty({ example: 'ticket url', description: 'Ticket confirming a payment' })
  @IsUrl()
  paymentTicket!: string
}
