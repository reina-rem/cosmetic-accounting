import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import dataSource from './db/data-source'
import { UsersModule } from './modules/users/users.module'
import { PackagesModule } from './modules/packages/packages.module'
import { PaymentsModule } from './modules/payments/payments.module'
import { IngredientsModule } from './modules/ingredients/ingredients.module'
import { ProductsModule } from './modules/products/products.module'
import { OrdersModule } from './modules/orders/orders.module'
import { AuthModule } from './modules/auth/auth.module'
import { CustomerInfoModule } from './modules/customer-info/customer-info.module'
import { EmployeeInfoModule } from './modules/employee-info/employee-info.module'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from './modules/auth/roles.guard'
import { SessionMiddleware } from './modules/auth/session.middleware'
import { LoggerMiddleware } from './logger.middleware'

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),

    TypeOrmModule.forRoot(dataSource.options),

    PackagesModule,
    PaymentsModule,
    IngredientsModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
    AuthModule,
    CustomerInfoModule,
    EmployeeInfoModule,
    UsersModule,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware, LoggerMiddleware).forRoutes('*')
  }
}
