import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { Product } from '../../entities/product.entity'
import { UpdateProductInfoDto } from './dto/update-product-info.dto'
import { Ingredient } from '../../entities/ingredient.entity'
import { DataSource, EntityManager, In, Repository } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DepleteProductDto } from './dto/deplete-product.dto'
import { ReplenishProductDto } from './dto/replenish-product.dto'
import { ProductDto } from './dto/product.dto'
import { ProductWithIngredientsDto } from './dto/product-with-ingredients.dto'
import { PublicProductDto } from './dto/public-product.dto'
import { IngredientDto } from '../ingredients/ingredients.types'

@Injectable()
export class ProductsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<number> {
    return this.dataSource.manager.transaction('READ COMMITTED', async entityManager => {
      type IIngredient = IngredientDto & Pick<Ingredient, 'products'>
      const ingredients: IIngredient[] = await entityManager.find(Ingredient, {
        where: { 
          id: In(dto.ingredientsIds),
          isDeleted: false,
        },
        relations: {
          products: true,
        },
        select: {
          id: true,
          name: true,
          pricePerPackage: true,
          packagesInStock: true,
          quantityPerPackage: true,
          unit: true,
          products: true,
        }
      })

      if (ingredients.length < dto.ingredientsIds.length) {
        throw new NotFoundException()
      }

      const product = entityManager.create(Product, { ...dto, ingredients })

      await Promise.all(
        ingredients.map(async ingredient => {
          ingredient.products.push(product)
          await entityManager.save(ingredient)
        })
      )

      await entityManager.save(product)
      return product.id
    })
  }

  async getAll(): Promise<ProductDto[]> {
    return await this.productRepository.findBy(
      { isDeleted: false }
    ) satisfies ProductDto[]
  }

  async getAllWithIngredients(): Promise<ProductWithIngredientsDto[]> {
    return await this.productRepository.find({
      where: {
        isDeleted: false,
      },
      relations: {
        ingredients: true,
      },
    }) satisfies ProductWithIngredientsDto[]
  }

  async getAllPublic(): Promise<PublicProductDto[]> {
    return await this.productRepository.find({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
        quantityInStock: true,
      }
    }) satisfies PublicProductDto[]
  }

  async getById(id: number): Promise<ProductWithIngredientsDto> {
    return await this.productRepository.findOneOrFail({
      where: { 
        id,
        isDeleted: false,
      },
      relations: {
        ingredients: true
      },
    }).catch(
      () => Promise.reject(new NotFoundException())
    ) satisfies ProductWithIngredientsDto
  }

  async delete(id: number): Promise<void> {
    const result = await this.productRepository.update({ id }, { isDeleted: true })

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  async updateInfo(
    id: number,
    dto: UpdateProductInfoDto,
  ): Promise<void> {
    return this.dataSource.manager.transaction('SERIALIZABLE', async entityManager => {
      if (!Object.values(dto).some(Boolean)) {
        throw new BadRequestException()
      }

      const product: ProductWithIngredientsDto = await entityManager.findOneOrFail(Product, {
        where: { 
          id, 
          isDeleted: false,
        },
        relations: {
          ingredients: true,
        },
      }).catch(
        () => Promise.reject(new NotFoundException('Product not found'))
      )

      if (dto.ingredientsIds) {
        type IIngredient = IngredientDto & Pick<Ingredient, 'products'>
        const ingredients: IIngredient[] = await entityManager.find(Ingredient, {
          where: { 
            id: In(dto.ingredientsIds),
            isDeleted: false,
          },
          relations: {
            products: true
          },
        })

        if (ingredients.length < dto.ingredientsIds.length) {
          throw new NotFoundException('Some ingredients not found')
        }

        await Promise.all(
          ingredients.map(async ingredient => {
            ingredient.products.push(product)
            await entityManager.save(ingredient)
          })
        )

        product.ingredients = ingredients
      }

      delete dto.ingredientsIds

      await entityManager.update(
        Product, 
        { id }, 
        { ...dto },
      )
      await entityManager.save(product)
    })
  }

  async replenish(
    id: number,
    { quantityDelta }: ReplenishProductDto,
    entityManager?: EntityManager,
  ): Promise<void> {
    const perform = async (entityManager: EntityManager) => {
      const product: ProductDto = await entityManager.findOneByOrFail(Product, { 
        id,
        isDeleted: false, 
      }).catch(() => Promise.reject(new NotFoundException()))
      product.quantityInStock += quantityDelta

      await entityManager.save(product)
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
    { quantityDelta }: DepleteProductDto,
    entityManager?: EntityManager,
  ): Promise<void> {
    const perform = async (entityManager: EntityManager) => {
      const product: ProductDto = await entityManager.findOneByOrFail(Product, { 
        id,
        isDeleted: false 
      }).catch(() => Promise.reject(new NotFoundException()))

      if (quantityDelta > product.quantityInStock) {
        throw new BadRequestException('Quantity delta is greater than current quantity in stock')
      }

      product.quantityInStock -= quantityDelta

      await entityManager.save(product)
    }

    if (entityManager) {
      return perform(entityManager)
    } else {
      // Note: SERIALIZABLE level is used because TypeORM doesn't provide a way to safely edit changes atomically
      return this.dataSource.manager.transaction('SERIALIZABLE', perform)
    }
  }
}
