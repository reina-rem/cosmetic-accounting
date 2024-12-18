import { Injectable, NotFoundException } from '@nestjs/common'
import { Order } from '../../entities/order.entity'
import { IsNull, Not, Repository } from 'typeorm'
import { OrderDto } from './dto/order.dto'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CourierOrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async getAll(): Promise<OrderDto[]> {
    return await this.orderRepository.findBy({
      status: 'ready', 
      deliveryDate: Not(IsNull()) 
    }) satisfies OrderDto[]
  }

  async setStatusCompleted(id: number): Promise<void> {
    const result = await this.orderRepository.update({ 
      id,
      status: 'ready',
    }, { 
      status: 'completed' 
    })

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
}
