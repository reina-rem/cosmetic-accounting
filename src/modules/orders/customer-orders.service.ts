import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { ConsultantOrdersService } from './consultant-orders.service'
import { Order } from '../../entities/order.entity'
import { CreateCustomerOrderDto } from './dto/create-order.dto'
import { UpdateOrderDeliveryDateDto } from './dto/update-order-delivery-date.dto'
import { OrderDto } from './dto/order.dto'
import { OrderWithItemsDto } from './dto/order-with-items.dto'

@Injectable()
export class CustomerOrdersService {
  constructor(
    private consultantOrdersService: ConsultantOrdersService,
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async create(
    dto: CreateCustomerOrderDto, 
    userId: number,
  ): Promise<number> {
    // Feature: Check the payment ticket
    return this.consultantOrdersService.create({ ...dto, customerId: userId })
  }

  async getAll(
    userId: number,
  ): Promise<OrderDto[]> {
    return this.orderRepository.findBy({ 
      customer: { 
        id: userId,
      },
    })
  }

  async getById(
    id: number,
    userId: number,
  ): Promise<OrderWithItemsDto> {
    return await this.orderRepository.findOneOrFail({
      where: { 
        id,
        customer: {
          id: userId
        },
      },
      relations: {
        items: true,
      },
    }).catch(
      () => Promise.reject(new NotFoundException())
    ) satisfies OrderWithItemsDto
  }

  async updateDeliveryDate(
    id: number,
    { deliveryDate }: UpdateOrderDeliveryDateDto,
    userId: number,
  ): Promise<void> {
    const updateCustomerOrderResult = await this.orderRepository.update(
      { 
        id, 
        customer: {
          id: userId,
        },
        status: 'ready' 
      },
      { deliveryDate }
    )

    if (updateCustomerOrderResult.affected === 0) {
      throw new NotFoundException()
    }

    // Feature: Notify courier that the order is ready to deliver
  }
}
