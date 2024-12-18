import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { Payment } from '../../entities/payment.entity'
import { UpdatePaymentDto } from './dto/update-payment.dto'
import { PaymentDto } from './dto/payment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<number> {
    const payment = await this.paymentRepository.save(
      this.paymentRepository.create({ ...dto })
    )
    
    return payment.id
  }

  async getAll(): Promise<PaymentDto[]> {
    return await this.paymentRepository.findBy(
      { isDeleted: false }
    ) satisfies PaymentDto[]
  }

  async delete(id: number): Promise<void> {
    const result = await this.paymentRepository.update({ id }, { isDeleted: true })

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  async update(
    id: number, 
    dto: UpdatePaymentDto
  ): Promise<void> {
    if (!Object.values(dto).some(Boolean)) {
      throw new BadRequestException()
    }

    const result = await this.paymentRepository.update({ id }, dto)

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
}
