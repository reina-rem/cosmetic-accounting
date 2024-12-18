import { Module } from '@nestjs/common'
import { ConsultantOrdersController } from './consultant-orders.controller'
import { ConsultantOrdersService } from './consultant-orders.service'
import { ProductsModule } from '../products/products.module'
import { PackagesModule } from '../packages/packages.module'
import { CustomerOrdersService } from './customer-orders.service'
import { ManufacturerOrdersService } from './manufacturer-orders.service'
import { CourierOrdersService } from './courier-orders.service'
import { CustomerOrdersController } from './customer-orders.controller'
import { ManufacturerOrdersController } from './manufacturer-orders.controller'
import { CourierOrdersController } from './courier-orders.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '../../entities/order.entity'
import { Package } from '../../entities/package.entity'

@Module({
  controllers: [
    ConsultantOrdersController,
    CourierOrdersController,
    CustomerOrdersController,
    ManufacturerOrdersController,
  ],
  providers: [
    ConsultantOrdersService,
    CourierOrdersService,
    CustomerOrdersService,
    ManufacturerOrdersService,
  ],
  imports: [
    TypeOrmModule.forFeature([Order, Package]),
    
    PackagesModule,
    ProductsModule,
  ]
})
export class OrdersModule {}
