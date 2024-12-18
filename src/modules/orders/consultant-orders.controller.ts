import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ConsultantOrdersService } from './consultant-orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDeliveryDateDto } from './dto/update-order-delivery-date.dto'
import { Roles } from '../auth/roles-guard.decorator'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UpdateOrderTicketDto } from './dto/update-order-ticket.dto'
import { OrderDto } from './dto/order.dto'
import { FullOrderDto } from './dto/full-order.dto'

@ApiTags('Consultant Orders')
@Controller('consultant-orders')
export class ConsultantOrdersController {
  constructor(private service: ConsultantOrdersService) {}

  @ApiOperation({ summary: 'Create a new order as consultant' })
  @ApiResponse({ status: 201, example: 1 })
  @Roles(['consultant'])
  @Post()
  async create(
    @Body() dto: CreateOrderDto,
  ): Promise<number> {
    return this.service.create(dto)
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, type: [OrderDto] }) 
  @Roles(['consultant', 'owner'])
  @Get()
  async getAll(): Promise<OrderDto[]> {
    return this.service.getAll()
  }

  @ApiOperation({ summary: 'Get the order by id as consultant' })
  @ApiResponse({ status: 200, type: FullOrderDto }) 
  @Roles(['consultant', 'owner'])
  @Get(':id')
  async getById(
    @Param('id') id: number,
  ): Promise<FullOrderDto> {
    return this.service.getById(id)
  }

  @ApiOperation({ summary: 'Update the payment ticket of the order' })
  @Roles(['consultant'])
  @Put(':id/ticket')
  async updateTicket(
    @Param('id') id: number,
    @Body() dto: UpdateOrderTicketDto,
  ): Promise<void> {
    return this.service.updateTicket(id, dto)
  }

  @ApiOperation({ summary: 'Update the delivery date of the order as consultant' })
  @Roles(['consultant'])
  @Put(':id/delivery-date')
  async updateDeliveryDate(
    @Param('id') id: number,
    @Body() dto: UpdateOrderDeliveryDateDto,
  ): Promise<void> {
    return this.service.updateDeliveryDate(id, dto)
  }

  @ApiOperation({ summary: 'Set the order status to cancelled' })
  @Roles(['consultant'])
  @Put(':id/status-cancelled')
  async setStatusCancelled(
    @Param('id') id: number,
  ): Promise<void> {
    return this.service.setStatusCancelled(id)
  }
}
