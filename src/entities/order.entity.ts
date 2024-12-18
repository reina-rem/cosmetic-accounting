import { IsISO8601, IsIn, IsInt, IsPhoneNumber, IsPositive, IsString, IsUrl } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { OrderItem } from './order-item.entity'
import { Package } from './package.entity'
import { User } from './user.entity'

export type OrderStatus = (typeof orderStatuses)[number]
export const orderStatuses = [
  'pending',
  'ready',
  'completed',
  'cancelled',
] as const

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  customer!: User | null

  @OneToMany(() => OrderItem, item => item.order)
  items!: OrderItem[]

  @ManyToOne(() => Package, { nullable: true })
  @JoinColumn()
  package!: Package | null

  @IsInt()
  @IsPositive()
  @Column({ type: 'int', default: 0 })
  totalPrice!: number

  @IsUrl()
  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentTicket!: string | null

  @IsIn(orderStatuses)
  @Column({
    type: 'varchar', 
    length: 50, 
    default: 'pending' 
  })
  status!: OrderStatus

  @IsISO8601()
  @Column({ type: 'date', nullable: true })
  deliveryDate!: string | null

  @IsString()
  @Column({ type: 'varchar', length: 255 })
  deliveryAddress!: string

  @IsPhoneNumber()
  @Column({ type: 'varchar', length: 20 })
  customerPhone!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
