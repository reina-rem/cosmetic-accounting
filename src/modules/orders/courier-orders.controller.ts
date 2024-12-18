import { Controller, Get, Param, Put } from '@nestjs/common'
import { CourierOrdersService } from './courier-orders.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/roles-guard.decorator'
import { OrderDto } from './dto/order.dto'

@ApiTags('Courier Orders')
@Controller('courier-orders')
export class CourierOrdersController {
  constructor(private service: CourierOrdersService) {}

  @ApiOperation({ summary: 'Get all orders as courier' })
  @ApiResponse({ status: 200, type: [OrderDto] }) 
  @Roles(['courier'])
  @Get()
  async getAll(): Promise<OrderDto[]> {
    return this.service.getAll()
  }

  @ApiOperation({ summary: 'Set the order status to completed' })
  @Roles(['courier'])
  @Put(':id/status-completed')
  async setStatusCompleted(
    @Param('id') id: number,
  ): Promise<void> {
    return this.service.setStatusCompleted(id)
  }
}
