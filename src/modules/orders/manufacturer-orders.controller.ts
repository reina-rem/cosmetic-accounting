import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { ManufacturerOrdersService } from './manufacturer-orders.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/roles-guard.decorator'
import { UpdateOrderPackageDto } from './dto/update-order-package.dto'
import { OrderWithItemsDto } from './dto/order-with-items.dto'

@ApiTags('Manufacturer Orders')
@Controller('manufacturer-orders')
export class ManufacturerOrdersController {
  constructor(private service: ManufacturerOrdersService) {}

  @ApiOperation({ summary: 'Get all orders as manufacturer' })
  @ApiResponse({ status: 200, type: [OrderWithItemsDto] }) 
  @Roles(['manufacturer'])
  @Get()
  async getAll(): Promise<OrderWithItemsDto[]> {
    return this.service.getAll()
  }

  @ApiOperation({ summary: 'Associate a new package with the order' })
  @Roles(['manufacturer'])
  @Put(':id/package')
  async updatePackage(
    @Param('id') id: number,
    @Body() dto: UpdateOrderPackageDto,
  ): Promise<void> {
    return this.service.updatePackage(id, dto)
  }

  @ApiOperation({ summary: 'Set the order status to ready' })
  @Roles(['manufacturer'])
  @Put(':id/status-ready')
  async setStatusReady(
    @Param('id') id: number,
  ): Promise<void> {
    return this.service.setStatusReady(id)
  }
}
