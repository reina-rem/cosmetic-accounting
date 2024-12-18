import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { PaymentsService } from './payments.service'
import { UpdatePaymentDto } from './dto/update-payment.dto'
import { Roles } from '../auth/roles-guard.decorator'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { PaymentDto } from './dto/payment.dto'

@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, example: 1 }) 
  @Roles(['manager'])
  @Post()
  async create(@Body() dto: CreatePaymentDto): Promise<number> {
    return this.service.create(dto)
  }

  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, type: [PaymentDto] }) 
  @Roles(['manager', 'owner'])
  @Get()
  async getAll(): Promise<PaymentDto[]> {
    return this.service.getAll()
  }
  
  @ApiOperation({ summary: 'Delete the payment by id' })
  @Roles(['manager'])
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.service.delete(id)
  }

  @ApiOperation({ summary: `Update the payment's info by id` })
  @Roles(['manager'])
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePaymentDto
  ): Promise<void> {
    return this.service.update(id, dto)
  }
}
