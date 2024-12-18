import { IsEmail, IsIn, IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export type UserRole = (typeof userRoles)[number]
export const userRoles = [
  'owner',
  'manager',
  'consultant',
  'manufacturer',
  'courier',
  'customer',
] as const

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number
  
  @IsIn(userRoles)
  @Column({ type: 'simple-array' })
  roles!: UserRole[]

  @IsEmail()
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string

  @IsString()
  @Column({ type: 'varchar', length: 255, select: false, nullable: true })
  passwordHash!: string | null

  @IsString()
  @Column({ type: 'varchar', length: 255, select: false, nullable: true })
  passwordKey!: string | null
}
