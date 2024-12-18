import { Module } from '@nestjs/common'
import { PackagesController } from './packages.controller'
import { PackagesService } from './packages.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Package } from '../../entities/package.entity'

@Module({
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [
    PackagesService,
  ],
  imports: [
    TypeOrmModule.forFeature([Package])
  ]
})
export class PackagesModule {}
