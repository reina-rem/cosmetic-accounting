import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreatePackageDto } from './dto/create-package.dto'
import { Package } from '../../entities/package.entity'
import { UpdatePackageDto } from './dto/update-package.dto'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { ReplenishPackageDto } from './dto/replenish-package.dto'
import { DepletePackageDto } from './dto/deplete-package.dto'
import { PackageDto } from './dto/package.dto'

@Injectable()
export class PackagesService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Package) private packageRepository: Repository<Package>,
  ) {}

  async create(dto: CreatePackageDto): Promise<number> {
    const orderPackage = await this.packageRepository.save(
      this.packageRepository.create({ ...dto })
    )

    return orderPackage.id
  }
  
  async getAll(): Promise<PackageDto[]> {
    return await this.packageRepository.findBy(
      { isDeleted: false }
    ) satisfies PackageDto[]
  }
  
  async delete(id: number): Promise<void> {
    const result = await this.packageRepository.update({ id }, { isDeleted: true })

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
  
  async updateInfo(
    id: number,
    dto: UpdatePackageDto,
  ): Promise<void> {
    if (!Object.values(dto).some(Boolean)) {
      throw new BadRequestException()
    }

    const result = await this.packageRepository.update({ id }, dto)

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  async replenish(
    id: number,
    { quantityDelta }: ReplenishPackageDto,
    entityManager?: EntityManager,
  ): Promise<void> {
    const perform = async (entityManager: EntityManager) => {
      const orderPackage: PackageDto = await entityManager.findOneByOrFail(Package, { 
        id,
        isDeleted: false,
      }).catch(() => Promise.reject(new NotFoundException()))

      orderPackage.quantityInStock += quantityDelta
      await entityManager.save(orderPackage)
    }

    if (entityManager) {
      return perform(entityManager)
    } else {
      // Note: SERIALIZABLE level is used because TypeORM doesn't provide a way to safely edit changes atomically
      return this.dataSource.manager.transaction('SERIALIZABLE', perform)
    }
  }

  async deplete(
    id: number, 
    { quantityDelta }: DepletePackageDto,
    entityManager?: EntityManager,
  ): Promise<void> {
    const perform = async (entityManager: EntityManager) => {
      const orderPackage: PackageDto = await entityManager.findOneByOrFail(Package, { 
        id,
        isDeleted: false,
      }).catch(() => Promise.reject(new NotFoundException()))

      if (quantityDelta > orderPackage.quantityInStock) {
        throw new BadRequestException('Quantity delta is greater than current quantity in stock')
      }

      orderPackage.quantityInStock -= quantityDelta
      await entityManager.save(orderPackage)
    }

    if (entityManager) {
      return perform(entityManager)
    } else {
      // Note: SERIALIZABLE level is used because TypeORM doesn't provide a way to safely edit changes atomically
      return this.dataSource.manager.transaction('SERIALIZABLE', perform)
    }
  }
}
