import { Injectable, NotFoundException } from '@nestjs/common'
import { PackagesService } from '../packages/packages.service'
import { Order } from '../../entities/order.entity'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { UpdateOrderPackageDto } from './dto/update-order-package.dto'
import { Package } from '../../entities/package.entity'
import { OrderWithItemsDto } from './dto/order-with-items.dto'
import { PackageDto } from '../packages/packages.types'
import { FullOrderDto } from './orders.types'

@Injectable()
export class ManufacturerOrdersService {
  constructor(
    private packagesService: PackagesService,
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Package) private packageRepository: Repository<Package>,
  ) {}

  async getAll(): Promise<OrderWithItemsDto[]> {
    return await this.orderRepository.find({
      where: {
        status: 'pending' 
      },
      relations: {
        items: true,
      }
    }) satisfies OrderWithItemsDto[]
  }

  async updatePackage(
    id: number,
    { packageId }: UpdateOrderPackageDto,
  ): Promise<void> {
    const orderPackage: PackageDto = await this.packageRepository.findOneByOrFail({ 
      id: packageId,
      isDeleted: false,
    }).catch(
      () => Promise.reject(new NotFoundException())
    )

    const result = await this.orderRepository.update(
      { id }, 
      { package: orderPackage }
    )

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  async setStatusReady(id: number): Promise<void> {
    // Note: SERIALIZABLE level is used instead of READ COMMITTED because 'deplete' is called
    return this.dataSource.manager.transaction('SERIALIZABLE', async entityManager => {
      const order: FullOrderDto = await entityManager.findOneOrFail(Order, {
        where: { 
          id,
        },
        relations: {
          package: true,
          items: true,
        },
      }).catch(
        () => Promise.reject(new NotFoundException())
      )

      if (!order.package) {
        throw new NotFoundException('Package is not set for the order')
      }

      await this.packagesService.deplete(
        order.package.id, 
        { quantityDelta: 1 }, 
        entityManager
      )

      await Promise.all(
        order.items.map(async item => {
          item.product.quantityReserved--
          await entityManager.save(item.product)
        })
      )

      await entityManager.update(
        Order, 
        { id: order.id }, 
        { status: 'ready' }
      )

      // Feature: Send an email notification to the customer that the order is ready
    })
  }
}