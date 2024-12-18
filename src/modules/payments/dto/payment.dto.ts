import { ApiProperty } from '@nestjs/swagger'
import { PaymentCategory } from '../../../entities/payment.entity'

export class PaymentDto {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 'taxes' })
  category!: PaymentCategory

  @ApiProperty({ example: 450050, description: 'Payment amount in cents' })
  amount!: number

  @ApiProperty({ example: '2024-01-30' })
  date!: string
}
