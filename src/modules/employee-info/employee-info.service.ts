import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { EmployeeInfo } from '../../entities/employee-info.entity'
import { EmployeeInfoDto } from './dto/employee-info.dto'
import { UpdateEmployeeInfoDto } from './dto/update-employee-info.dto'
import { CreateEmployeeAccountDto } from './dto/create-employee-account.dto'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { User, UserRole } from '../../entities/user.entity'
import { UserInfoDto } from '../auth/dto/user-info.dto'
import { AuthService } from '../auth/auth.service'
import { SafeUserDto } from '../users/dto/safe-user.dto'

@Injectable()
export class EmployeeInfoService {
  constructor(
    private authService: AuthService,
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(EmployeeInfo) private employeeInfoRepository: Repository<EmployeeInfo>
  ) {}

  async registrateEmployeeAccount(
    dto: CreateEmployeeAccountDto,
  ): Promise<UserInfoDto> {
    return this.dataSource.manager.transaction('SERIALIZABLE', async entityManager => {
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
        const employee = await entityManager.save(
          entityManager.create(
            User, { ...dto }
          )
        )
  
        await entityManager.save(
          entityManager.create(EmployeeInfo, {
            ...dto,
            user: { id: employee.id },
          })
        )

        return this.authService.createUserInfo({
          id: employee.id,
          roles: dto.roles
        })
      }

      if (candidate.roles.some(role => role !== 'customer')) {
        throw new ForbiddenException('Employee with this email already exists')
      }

      const combinedRoles: UserRole[] = [...candidate.roles, ...dto.roles]
      await entityManager.update(
        User,
        { id: candidate.id }, 
        { roles: combinedRoles },
      )

      await entityManager.save(
        entityManager.create(EmployeeInfo, {
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

  async deleteEmployeeAccount(
    ownerId: number,
    employeeId: number,
  ): Promise<void> {
    return this.dataSource.manager.transaction('SERIALIZABLE', async entityManager => {
      if (employeeId === ownerId) {
        throw new BadRequestException('Cannot delete owner')
      }

      const employee: SafeUserDto = await entityManager.findOneByOrFail(User, {
        id: employeeId,
      }).catch(
        () => Promise.reject(new NotFoundException('User not found by employee id'))
      )

      const employeeInfo: EmployeeInfoDto = await entityManager.findOneByOrFail(EmployeeInfo, {
        user: { id: employee.id },
        isDeleted: false,
      }).catch(
        () => Promise.reject(new NotFoundException('Employee info not found by employee id'))
      )

      const result = await entityManager.update(
        EmployeeInfo,
        { id: employeeInfo.id }, 
        { isDeleted: true },
      )

      if (result.affected === 0) {
        throw new NotFoundException('Employee info not found by id')
      }

      const rolesWithOnlyCustomer = employee.roles.filter(role => role === 'customer')

      if (rolesWithOnlyCustomer.length === 0) {
        await entityManager.delete(
          User, { id: employeeId }
        )
      } else { 
        await entityManager.update(
          User,
          { id: employeeId }, 
          { roles: rolesWithOnlyCustomer },
        )
      }
    })
  }

  async getAll(): Promise<EmployeeInfoDto[]> {
    return await this.employeeInfoRepository.findBy({
      isDeleted: false
    }) satisfies EmployeeInfoDto[]
  }

  async getById(employeeId: number): Promise<EmployeeInfoDto> {
    return await this.employeeInfoRepository.findOneByOrFail({ 
      user: {
        id: employeeId
      },
      isDeleted: false,
    }
    ).catch(
      () => Promise.reject(new NotFoundException())
    ) satisfies EmployeeInfoDto
  }

  async update(
    employeeId: number,
    dto: UpdateEmployeeInfoDto,
  ): Promise<void> {
    if (!Object.values(dto).some(Boolean)) {
      throw new BadRequestException()
    }

    const result = await this.employeeInfoRepository.update(
      {
        user: {
          id: employeeId
        }
      },
      dto
    )
    
    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
}
