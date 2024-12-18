import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { UpdateIngredientInfoDto } from './dto/update-ingredient-info.dto'
import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { IngredientsService } from './ingredients.service'
import { DepleteIngredientDto } from './dto/deplete-ingredient.dto'
import { Roles } from '../auth/roles-guard.decorator'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReplenishIngredientDto } from './dto/replenish-ingredient.dto'
import { IngredientDto } from './dto/ingredient.dto'

@Controller('ingredients')
export class IngredientsController {
  constructor(private service: IngredientsService) {}

  @ApiOperation({ summary: 'Create a new ingredient' })
  @ApiResponse({ status: 201, example: 1 })
  @Roles(['manager'])
  @Post()
  async create(
    @Body() dto: CreateIngredientDto
  ): Promise<number> {
    return this.service.create(dto)
  }

  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiResponse({ status: 200, type: [IngredientDto] })
  @Roles(['manager', 'owner'])
  @Get()
  async getAll(): Promise<IngredientDto[]> {
    return this.service.getAll()
  }

  @ApiOperation({ summary: 'Delete the ingredient by id' })
  @Roles(['manager'])
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.service.delete(id)
  }

  @ApiOperation({ summary: 'Update the ingredient by id' })
  @Roles(['manager'])
  @Put(':id/info')
  async updateInfo(
    @Param('id') id: number,
    @Body() dto: UpdateIngredientInfoDto,
  ): Promise<void> {
    return this.service.updateInfo(id, dto)
  }
  
  @ApiOperation({ summary: 'Increase the quantity of the ingredient in stock' })
  @Roles(['manager'])
  @Put(':id/replenish')
  async replenish(
    @Param('id') id: number,
    @Body() dto: ReplenishIngredientDto,
  ): Promise<void> {
    return this.service.replenish(id, dto)
  }

  @ApiOperation({ summary: 'Decrease the quantity of the ingredient from stock' })
  @Roles(['manager', 'manufacturer'])
  @Put(':id/deplete')
  async deplete(
    @Param('id') id: number,
    @Body() dto: DepleteIngredientDto,
  ): Promise<void> {
    return this.service.deplete(id, dto)
  }
}
