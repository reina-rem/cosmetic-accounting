import { IsInt, IsPositive, IsString, Min } from 'class-validator'
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Product } from './product.entity'

export type IngredientUnit = (typeof ingredientUnits)[number]
export const ingredientUnits = ['kg', 'l', 'g', 'ml', 'pc'] as const

@Entity()
export class Ingredient {
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
  pricePerPackage!: number

  @IsInt()
  @Min(0)
  @Column({ type: 'int', default: 0 })
  packagesInStock!: number

  @IsInt()
  @IsPositive()
  @Column({ type: 'int' })
  quantityPerPackage!: number

  @IsString()
  @Column({ type: 'varchar', length: 10 })
  unit!: IngredientUnit

  @ManyToMany(() => Product, product => product.ingredients)
  products!: Product[]
}
