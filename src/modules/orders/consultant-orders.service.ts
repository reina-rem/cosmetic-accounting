import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDeliveryDateDto } from './dto/update-order-delivery-date.dto'
import { Order } from '../../entities/order.entity'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, In, Repository } from 'typeorm'
import { Product } from '../../entities/product.entity'
import { OrderItem } from '../../entities/order-item.entity'
import { User } from '../../entities/user.entity'
import { UpdateOrderTicketDto } from './dto/update-order-ticket.dto'
import { ProductsService } from '../products/products.service'
import { OrderDto } from './dto/order.dto'
import { FullOrderDto } from './dto/full-order.dto'
import { ProductDto } from '../products/products.types'

@Injectable()
export class ConsultantOrdersService {
  constructor(
    private productsService: ProductsService,
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async create(
    dto: CreateOrderDto,
  ): Promise<number> {
    // Note: SERIALIZABLE level is used instead of READ COMMITTED because 'deplete' is called
    return this.dataSource.manager.transaction('SERIALIZABLE', async entityManager => {
      const order = await entityManager.save(
        entityManager.create(Order, { ...dto })
      )

      const productsIds = dto.orderItems.map(item => item.productId)
      const products: ProductDto[] = await entityManager.find(Product, {
        where: { 
          id: In(productsIds),
          isDeleted: false,
        }
      })

      if (products.length < productsIds.length) {
        throw new NotFoundException()
      }

      const items = await Promise.all(
        dto.orderItems.map(async itemDto => {
          const product = products.find(product => product.id === itemDto.productId)
  
          if (!product) {
            throw new NotFoundException('Product not found by id')
          }
  
          const item = await entityManager.save(
            entityManager.create(OrderItem, { 
              order,
              price: product.price,
              product,
              quantity: itemDto.quantity,
            })
          )

          await this.productsService.deplete(
            product.id, 
            { quantityDelta: item.quantity }, 
            entityManager,
          )

          product.quantityReserved++
          await entityManager.save(product)
  
          return item
        })
      )

      const totalPrice = items.reduce((sum, item) => sum + item.price, 0)

      if (dto.customerId) {
        const customer = await entityManager.findOneByOrFail(User, { 
          id: dto.customerId,
        }).catch(
          () => Promise.reject(new NotFoundException())
        )

        order.customer = customer

        if (customer.roles.some(role => role !== 'customer')) {
          order.totalPrice = totalPrice - Math.floor(totalPrice * 0.10)
        }

        await entityManager.save(order)
      } else {
        order.totalPrice = totalPrice
        await entityManager.save(order) 
      }
      
      return order.id

      // Feature: Notify manufacturer that the order is pending
    })
  }

  async getAll(): Promise<OrderDto[]> {
    return await this.orderRepository.find() satisfies OrderDto[]
  }

  async getById(id: number): Promise<FullOrderDto> {
    return await this.orderRepository.findOneOrFail({
      where: { 
        id,
      },
      relations: {
        customer: true,
        items: true,
        package: true,
      },
    }).catch(
      () => Promise.reject(new NotFoundException())
    ) satisfies FullOrderDto
  }

  async updateTicket(
    id: number,
    { paymentTicket }: UpdateOrderTicketDto, 
  ): Promise<void> {
    const result = await this.orderRepository.update({ id }, { paymentTicket })

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  async updateDeliveryDate(
    id: number,
    { deliveryDate }: UpdateOrderDeliveryDateDto,
  ): Promise<void> {
    const order: OrderDto = await this.orderRepository.findOneByOrFail({ 
      id,
      status: 'ready',
    }).catch(
      () => Promise.reject(new NotFoundException())
    )

    const isNotPaid = order.paymentTicket === null
    if (isNotPaid) {
      throw new BadRequestException('Order is not paid')
    }
    
    await this.orderRepository.update(
      { id: order.id }, 
      { deliveryDate },
    )

    // Feature: Notify courier that the order is ready to deliver
  }

  async setStatusCancelled(id: number): Promise<void> {
    // Note: SERIALIZABLE level is used instead of READ COMMITTED because 'replenish' is called
    return this.dataSource.manager.transaction('SERIALIZABLE', async entityManager => {
      const order: FullOrderDto = await entityManager.findOneOrFail(Order, {
        where: { 
          id 
        },
        relations: {
          items: true,
        }
      }
      ).catch(
        () => Promise.reject(new NotFoundException())
      )

      await Promise.all(
        order.items.map(async item => (
          await this.productsService.replenish(
            item.product.id, 
            { quantityDelta: item.quantity },
            entityManager,
          )
        ))
      )

      await entityManager.update(
        Order,
        { id: order.id }, 
        { status: 'cancelled' }
      )
    })
  }
}
