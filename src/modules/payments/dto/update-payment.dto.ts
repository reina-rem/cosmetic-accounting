import { IsISO8601, IsIn, IsOptional, IsPositive } from 'class-validator'
import { paymentCategories, PaymentCategory } from '../../../entities/payment.entity'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePaymentDto {
  @ApiProperty({ example: 'taxes' })
  @IsOptional()
  @IsIn(paymentCategories)
  category?: PaymentCategory

  @ApiProperty({ example: 450050, description: 'Payment amount in cents' })
  @IsOptional()
  @IsPositive()
  amount?: number

  @ApiProperty({ example: '2024-01-30', description: 'Payment date' })
  @IsOptional()
  @IsISO8601()
  date?: string
}
