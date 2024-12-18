import { Module } from '@nestjs/common'
import { CustomerInfoController } from './customer-info.controller'
import { CustomerInfoService } from './customer-info.service'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerInfo } from '../../entities/customer-info.entity'

@Module({
  controllers: [CustomerInfoController],
  providers: [CustomerInfoService],
  imports: [
    TypeOrmModule.forFeature([CustomerInfo]),

    AuthModule,
    UsersModule,
  ],
  exports: [
    CustomerInfoService,
  ]
})
export class CustomerInfoModule {}
