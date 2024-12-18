import { IsISO8601, IsString } from 'class-validator'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class CustomerInfo {
  @PrimaryGeneratedColumn()
  id!: number

  @IsString()
  @Column({ type: 'varchar', length: 255 })
  name!: string

  @IsISO8601()
  @Column({ type: 'date' })
  birthday!: string

  @IsString()
  @Column({ type: 'text', default: '' })
  note!: string

  @OneToOne(() => User)
  @JoinColumn()
  user!: User
}
