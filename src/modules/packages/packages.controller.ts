import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CreatePackageDto } from './dto/create-package.dto'
import { PackagesService } from './packages.service'
import { UpdatePackageDto } from './dto/update-package.dto'
import { Roles } from '../auth/roles-guard.decorator'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReplenishPackageDto } from './dto/replenish-package.dto'
import { DepletePackageDto } from './dto/deplete-package.dto'
import { PackageDto } from './dto/package.dto'

@Controller('packages')
export class PackagesController {
  constructor(private service: PackagesService) {}
  
  @ApiOperation({ summary: 'Add a new package' })
  @ApiResponse({ status: 201, example: 1 })
  @Roles(['manager'])
  @Post()
  async create(
    @Body() dto: CreatePackageDto
  ): Promise<number> {
    return this.service.create(dto)
  }
  
  @ApiOperation({ summary: 'Get all packages' })
  @ApiResponse({ status: 200, type: [PackageDto] }) 
  @Roles(['owner', 'manager', 'manufacturer'])
  @Get()
  async getAll(): Promise<PackageDto[]> {
    return this.service.getAll()
  }

  @ApiOperation({ summary: 'Delete the package by id' })
  @Roles(['manager'])
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.service.delete(id)
  }

  @ApiOperation({ summary: 'Update the package by id' })
  @Roles(['manager'])
  @Put(':id/info')
  async updateInfo(
    @Param('id') id: number,
    @Body() dto: UpdatePackageDto,
  ): Promise<void> {
    return this.service.updateInfo(id, dto)
  }

  @ApiOperation({ summary: 'Increase the quantity of the package in stock' })
  @Roles(['manager'])
  @Put(':id/replenish')
  async replenish(
    @Param('id') id: number,
    @Body() dto: ReplenishPackageDto,
  ): Promise<void> {
    return this.service.replenish(id, dto)
  }

  @ApiOperation({ summary: 'Decrease the quantity of the package from stock' })
  @Roles(['manager', 'manufacturer'])
  @Put(':id/deplete')
  async deplete(
    @Param('id') id: number,
    @Body() dto: DepletePackageDto,
  ): Promise<void> {
    return this.service.deplete(id, dto)
  }
}
