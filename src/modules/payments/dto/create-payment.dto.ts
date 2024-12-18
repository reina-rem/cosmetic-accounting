import { IsISO8601, IsIn, IsPositive } from 'class-validator'
import { paymentCategories, PaymentCategory } from '../../../entities/payment.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePaymentDto {
  @ApiProperty({ example: 'salary' })
  @IsIn(paymentCategories)
  category!: PaymentCategory

  @ApiProperty({ example: 450050, description: 'Payment amount in cents' })
  @IsPositive()
  amount!: number

  @ApiProperty({ example: '2024-01-30', description: 'Payment date' })
  @IsISO8601()
  date!: string
}
