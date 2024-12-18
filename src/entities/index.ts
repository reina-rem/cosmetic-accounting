import { Ingredient } from './ingredient.entity'
import { OrderItem } from './order-item.entity'
import { Order } from './order.entity'
import { Payment } from './payment.entity'
import { Product } from './product.entity'
import { Package } from './package.entity'
import { User } from './user.entity'
import { CustomerInfo } from './customer-info.entity'
import { EmployeeInfo } from './employee-info.entity'

export const entities = [
  CustomerInfo,
  EmployeeInfo,
  Ingredient,
  OrderItem,
  Order,
  Package,
  Payment,
  Product,
  User,
]
