import { IsInt, IsPositive, IsString, Min } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Package {
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
}
