import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { Roles } from '../auth/roles-guard.decorator'
import { UserId } from '../auth/user-id.decorator'

import { CustomerOrdersService } from './customer-orders.service'
import { CreateCustomerOrderDto } from './dto/create-order.dto'
import { UpdateOrderDeliveryDateDto } from './dto/update-order-delivery-date.dto'
import { OrderDto } from './dto/order.dto'
import { OrderWithItemsDto } from './dto/order-with-items.dto'

@ApiTags('Customer Orders')
@Controller('customer-orders')
export class CustomerOrdersController {
  constructor(private service: CustomerOrdersService) {}

  @ApiOperation({ summary: 'Create a new order as customer' })
  @ApiResponse({ status: 201, example: 1 }) 
  @Roles(['customer'])
  @Post()
  async create(
    @Body() dto: CreateCustomerOrderDto,
    @UserId() userId: number,
  ): Promise<number> {
    return this.service.create(dto, userId)
  }

  @ApiOperation({ summary: 'Get all orders as customer' })
  @ApiResponse({ status: 200, type: [OrderDto] }) 
  @Roles(['customer'])
  @Get()
  async getAll(
    @UserId() userId: number,
  ): Promise<OrderDto[]> {
    return this.service.getAll(userId)
  }

  @ApiOperation({ summary: 'Get the order by id as customer' })
  @ApiResponse({ status: 200, type: OrderWithItemsDto }) 
  @Roles(['customer'])
  @Get(':id')
  async getById(
    @Param('id') id: number,
    @UserId() userId: number,
  ): Promise<OrderWithItemsDto> {
    return this.service.getById(id, userId)
  }

  @ApiOperation({ summary: 'Update the delivery date of the order as customer' })
  @Roles(['customer'])
  @Put(':id/delivery-date')
  async updateDeliveryDate(
    @Param('id') id: number,
    @Body() dto: UpdateOrderDeliveryDateDto,
    @UserId() userId: number,
  ): Promise<void> {
    return this.service.updateDeliveryDate(id, dto, userId)
  }
}
