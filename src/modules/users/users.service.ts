import crypto from 'node:crypto'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from '../../entities/user.entity'
import { UpdateUserRolesDto } from './dto/update-user-roles.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(
    dto: CreateUserDto,
  ): Promise<number> {
    const passwordKey = this.generateRandomKey()
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, passwordKey })
    )
    
    delete (user as Partial<User>).passwordKey

    // Feature: Send an email with the password key

    return user.id
  }

  async updateUserRoles(
    id: number,
    dto: UpdateUserRolesDto,
  ): Promise<void> {
    const result = await this.userRepository.update(
      { id }, dto
    )

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  async delete(
    id: number,
  ): Promise<void> {
    const result = await this.userRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  private generateRandomKey(length = 16): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
  }
}
