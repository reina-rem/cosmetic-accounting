import { Module } from '@nestjs/common'
import { EmployeeInfoController } from './employee-info.controller'
import { EmployeeInfoService } from './employee-info.service'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmployeeInfo } from '../../entities/employee-info.entity'

@Module({
  controllers: [EmployeeInfoController],
  providers: [EmployeeInfoService],
  imports: [
    TypeOrmModule.forFeature([EmployeeInfo]),

    AuthModule,
    UsersModule,
  ]
})
export class EmployeeInfoModule {}
