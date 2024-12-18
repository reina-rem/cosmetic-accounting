import { IsISO8601, IsIn, IsInt, IsPositive } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export type PaymentCategory = (typeof paymentCategories)[number]
export const paymentCategories = [
  'salary',
  'rent',
  'utilities',
  'ingredients',
  'packaging',
  'marketing',
  'taxes',
] as const

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', default: false, select: false })
  isDeleted!: boolean

  @IsIn(paymentCategories)
  @Column({ type: 'varchar', length: 255 })
  category!: PaymentCategory

  @IsInt()
  @IsPositive()
  @Column({ type: 'int' })
  amount!: number

  @IsISO8601()
  @Column({ type: 'date' })
  date!: string
}
