import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Product } from './product.entity'
import { Order } from './order.entity'
import { IsInt, IsPositive } from 'class-validator'

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn()
  product!: Product

  @IsInt()
  @IsPositive()
  @Column({ type: 'int' })
  quantity!: number

  @IsInt()
  @IsPositive()
  @Column({ type: 'int' })
  price!: number

  @ManyToOne(() => Order, order => order.items)
  @JoinColumn()
  order!: Order
}
