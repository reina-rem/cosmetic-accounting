import { Module } from '@nestjs/common'
import { IngredientsController } from './ingredients.controller'
import { IngredientsService } from './ingredients.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Ingredient } from '../../entities/ingredient.entity'

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [
    TypeOrmModule.forFeature([Ingredient])
  ],
})
export class IngredientsModule {}
