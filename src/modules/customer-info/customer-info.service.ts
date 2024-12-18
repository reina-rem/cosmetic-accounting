import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CustomerInfo } from '../../entities/customer-info.entity'
import { FullCustomerInfoDto } from './dto/full-customer-info.dto'
import { CustomerInfoDto } from './dto/customer-info.dto'
import { UpdateCustomerInfoDto } from './dto/update-customer-info.dto'
import { UpdateCustomerNoteDto } from './dto/update-customer-note.dto'
import { RegistrateCustomerAccountDto } from './dto/registrate-customer-account.dto'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { UserInfoDto } from '../auth/dto/user-info.dto'
import { AuthService } from '../auth/auth.service'
import { DeleteCustomerAccountDto } from './dto/delete-customer-account.dto'
import { User, UserRole } from '../../entities/user.entity'
import { SafeUserDto } from '../users/dto/safe-user.dto'

@Injectable()
export class CustomerInfoService {
  constructor(
    private authService: AuthService,
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(CustomerInfo) private customerInfoRepository: Repository<CustomerInfo>
  ) {}

  async registrateCustomerAccount(
    dto: RegistrateCustomerAccountDto,
  ): Promise<UserInfoDto> {
    return this.dataSource.manager.transaction('SERIALIZABLE', async entityManager => {
      const customerRoles: UserRole[] = ['customer']
      const candidate: SafeUserDto | null = await entityManager.findOne(User, {
        where: {
          email: dto.email,
        },
        select: {
          id: true,
          roles: true,
        }
      })

      if (!candidate) {
        const customer = await entityManager.save(
          entityManager.create(User, { 
            ...dto, 
            roles: customerRoles, 
          })
        )

        await entityManager.save(
          entityManager.create(CustomerInfo, { 
            ...dto,
            user: { id: customer.id},
          })
        )

        return this.authService.createUserInfo({
          id: customer.id,
          roles: customerRoles,
        })
      }
      
      if (candidate.roles.includes('customer')) {
        throw new ForbiddenException('Customer with this email already exists')
      }

      const combinedRoles: UserRole[] = [...candidate.roles, ...customerRoles]
      await entityManager.update(
        User, 
        { id: candidate.id }, 
        { roles: combinedRoles },
      )

      await entityManager.save(
        entityManager.create(CustomerInfo, { 
          ...dto,
          user: { id: candidate.id },
        })
      )

      return this.authService.createUserInfo({
        id: candidate.id,
        roles: combinedRoles,
      })
    })
  }

  async deleteCustomerAccount(
    customerId: number,
    { password }: DeleteCustomerAccountDto,
  ): Promise<void> {
    return this.dataSource.manager.transaction('SERIALIZABLE', async entityManager => {
      type IUser = Pick<User, 'roles' | 'passwordHash' | 'email'>
      const customer: IUser = await entityManager.findOneOrFail(User, {
        where: { 
          id: customerId,
        },
        select: {
          roles: true,
          passwordHash: true,
          email: true,
        }
      }).catch(
        () => Promise.reject(new NotFoundException('User not found by customer id'))
      )

      if (customer.passwordHash) {
        await this.authService.verifyPassword(password, customer.email, customer.passwordHash)
      }

      const customerInfo: CustomerInfoDto = await entityManager.findOneByOrFail(CustomerInfo, {
        user: { id: customerId }
      }).catch(
        () => Promise.reject(new NotFoundException('Customer info not found by customer id'))
      )

      const result = await entityManager.delete(CustomerInfo, { id: customerInfo.id })
      if (result.affected === 0) {
        throw new NotFoundException('Customer info not found by id')
      }

      const rolesWithoutCustomer = customer.roles.filter(role => role !== 'customer')
      
      if (rolesWithoutCustomer.length === 0) {
        await entityManager.delete(User, { id: customerId })
      } else {
        await entityManager.update(
          User,
          { id: customerId }, 
          { roles: rolesWithoutCustomer },
        )
      }
    })
  }

  async getAll(): Promise<FullCustomerInfoDto[]> {
    return await this.customerInfoRepository.find({
      relations: {
        user: true
      }
    }) satisfies FullCustomerInfoDto[]
  }

  async getAccountInfo(customerId: number): Promise<CustomerInfoDto> {
    return await this.customerInfoRepository.findOneOrFail({
      where: {
        user: { 
          id: customerId,
        },
      },
      select: {
        id: true,
        name: true,
        birthday: true,
      }
    }).catch(
      () => Promise.reject(new NotFoundException())
    ) satisfies CustomerInfoDto
  }

  async getByCustomerId(
    id: number,
  ): Promise<FullCustomerInfoDto> {
    return await this.customerInfoRepository.findOneOrFail({
      where: {
        user: { id },
      },
      relations: {
        user: true,
      },
    }).catch(
      () => Promise.reject(new NotFoundException())
    ) satisfies FullCustomerInfoDto
  }

  async update(
    customerId: number,
    dto: UpdateCustomerInfoDto,
  ): Promise<void> {
    if (!Object.values(dto).some(Boolean)) {
      throw new BadRequestException()
    }
    
    const result = await this.customerInfoRepository.update(
      { id: customerId }, dto
    )

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  async updateNote(
    customerId: number,
    { note }: UpdateCustomerNoteDto,
  ): Promise<void> {
    const result = await this.customerInfoRepository.update(
      { id: customerId }, { note }
    )

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
}
