import { IsInt, IsPositive, IsString } from 'class-validator'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class EmployeeInfo {
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
  salary!: number

  @OneToOne(() => User, { eager: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  user!: User | null
}
