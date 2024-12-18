import { IsInt, IsPositive, IsString, Min } from 'class-validator'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn 
} from 'typeorm'

import { Ingredient } from './ingredient.entity'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'boolean', default: false, select: false })
  isDeleted!: boolean

  @IsString()
  @Column({ type: 'varchar', length: 255 })
  name!: string

  @IsInt()
  @IsPositive()
  @Column({ type: 'int' })
  price!: number

  @IsInt()
  @Min(0)
  @Column({ type: 'int', default: 0 })
  quantityInStock!: number

  @IsInt()
  @Min(0)
  @Column({ type: 'int', default: 0 })
  quantityReserved!: number

  @ManyToMany(() => Ingredient, ingredient => ingredient.products)
  @JoinTable()
  ingredients!: Ingredient[]

  @IsString()
  @Column({ type: 'text', default: '' })
  recipe!: string
}
