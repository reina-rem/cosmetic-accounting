import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Roles } from '../auth/roles-guard.decorator'

import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductInfoDto } from './dto/update-product-info.dto'
import { ReplenishProductDto } from './dto/replenish-product.dto'
import { DepleteProductDto } from './dto/deplete-product.dto'
import { ProductWithIngredientsDto } from './dto/product-with-ingredients.dto'
import { ProductDto } from './dto/product.dto'
import { PublicProductDto } from './dto/public-product.dto'

@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, example: 1 })
  @Roles(['manager'])
  @Post()
  async create(
    @Body() dto: CreateProductDto
  ): Promise<number> {
    return this.service.create(dto)
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, type: [ProductDto] })
  @Roles(['owner', 'manufacturer', 'consultant'])
  @Get('all')
  async getAll(): Promise<ProductDto[]> {
    return this.service.getAll()
  }

  @ApiOperation({ summary: 'Get all products with their ingredients' })
  @ApiResponse({ status: 200, type: [ProductWithIngredientsDto] }) 
  @Roles(['manager'])
  @Get('with-ingredients')
  async getAllWithIngredients(): Promise<ProductWithIngredientsDto[]> { 
    return this.service.getAllWithIngredients()
  }

  @ApiOperation({ summary: 'Get all products for customer' })
  @ApiResponse({ status: 200, type: [PublicProductDto] })
  @Get('public')
  async getAllPublic(): Promise<PublicProductDto[]> { 
    return this.service.getAllPublic()
  }

  @ApiOperation({ summary: 'Get the product by id' })
  @ApiResponse({ status: 200, type: ProductWithIngredientsDto })
  @Roles(['owner', 'manufacturer', 'consultant'])
  @Get(':id')
  async getById(
    @Param('id') id: number
  ): Promise<ProductWithIngredientsDto> {
    return this.service.getById(id)
  }

  @ApiOperation({ summary: 'Delete the product by id' })
  @Roles(['manager'])
  @Delete(':id')
  async delete(
    @Param('id') id: number
  ): Promise<void> {
    return this.service.delete(id)
  }

  @ApiOperation({ summary: 'Update the product by id' })
  @Roles(['manager'])
  @Put(':id/info')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateProductInfoDto,
  ): Promise<void> {
    return this.service.updateInfo(id, dto)
  }

  @ApiOperation({ summary: 'Increase the quantity of the product in stock' })
  @Roles(['manufacturer'])
  @Put(':id/replenish')
  async replenish(
    @Param('id') id: number,
    @Body() dto: ReplenishProductDto,
  ): Promise<void> {
    return this.service.replenish(id, dto)
  }

  @ApiOperation({ summary: 'Decrease the quantity of the product from stock' })
  @Roles(['manager', 'manufacturer'])
  @Put(':id/deplete')
  async deplete(
    @Param('id') id: number,
    @Body() dto: DepleteProductDto,
  ): Promise<void> {
    return this.service.deplete(id, dto)
  }
}
