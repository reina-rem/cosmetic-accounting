import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientInfoDto } from './dto/update-ingredient-info.dto'
import { DepleteIngredientDto } from './dto/deplete-ingredient.dto'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { Ingredient } from '../../entities/ingredient.entity'
import { ReplenishIngredientDto } from './dto/replenish-ingredient.dto'
import { IngredientDto } from './dto/ingredient.dto'

@Injectable()
export class IngredientsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Ingredient) private ingredientRepository: Repository<Ingredient>
  ) {}

  async create(dto: CreateIngredientDto): Promise<number> {
    const ingredient = await this.ingredientRepository.save(
      this.ingredientRepository.create({ ...dto })
    )
    
    return ingredient.id
  }

  async getAll(): Promise<IngredientDto[]> {
    return await this.ingredientRepository.findBy(
      { isDeleted: false }
    ) satisfies IngredientDto[]
  }

  async delete(id: number): Promise<void> {
    const result = await this.ingredientRepository.update({ id }, { isDeleted: true })

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  async updateInfo(
    id: number,
    dto: UpdateIngredientInfoDto,
  ): Promise<void> {
    if (!Object.values(dto).some(Boolean)) {
      throw new BadRequestException()
    }

    const result = await this.ingredientRepository.update({ id }, dto)

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  async replenish(
    id: number,
    { quantityDelta }: ReplenishIngredientDto,
    entityManager?: EntityManager,
  ): Promise<void> {
    const perform = async (entityManager: EntityManager) => {
      const ingredient: IngredientDto = await entityManager.findOneByOrFail(Ingredient, { 
        id, 
        isDeleted: false,
      }).catch(() => Promise.reject(new NotFoundException()))

      ingredient.packagesInStock += quantityDelta
      await entityManager.save(ingredient)
    }

    if (entityManager) {
      return perform(entityManager)
    } else {
      // Note: SERIALIZABLE level is used because TypeORM doesn't provide a way to safely edit changes atomically
      return this.dataSource.manager.transaction('SERIALIZABLE', perform)
    }
  }

  async deplete(
    id: number,
    { quantityDelta }: DepleteIngredientDto,
    entityManager?: EntityManager,
  ): Promise<void> {
    const perform = async (entityManager: EntityManager) => {
      const ingredient: IngredientDto = await entityManager.findOneByOrFail(Ingredient, { 
        id,
        isDeleted: false,
      }).catch(() => Promise.reject(new NotFoundException()))

      if (quantityDelta > ingredient.packagesInStock) {
        throw new BadRequestException('Quantity delta is greater than current quantity in stock')
      }

      ingredient.packagesInStock -= quantityDelta
      await entityManager.save(ingredient)
    }

    if (entityManager) {
      return perform(entityManager)
    } else {
      // Note: SERIALIZABLE level is used because TypeORM doesn't provide a way to safely edit changes atomically
      return this.dataSource.manager.transaction('SERIALIZABLE', perform)
    }
  }
}
