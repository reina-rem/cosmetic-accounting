import 'reflect-metadata'
import bcrypt from 'bcryptjs'
import dataSource from '../data-source'

import { Ingredient, IngredientUnit } from '../../entities/ingredient.entity'
import { Product } from '../../entities/product.entity'
import { Package } from '../../entities/package.entity'
import { User, UserRole } from '../../entities/user.entity'
import { Order, OrderStatus } from '../../entities/order.entity'
import { OrderItem } from '../../entities/order-item.entity'
import { Payment, PaymentCategory } from '../../entities/payment.entity'
import { EmployeeInfo } from '../../entities/employee-info.entity'
import { CustomerInfo } from '../../entities/customer-info.entity'

import data from './data.json'

async function encryptPassword(password: string, email: string): Promise<string> {
  const SALT_ROUNDS = 10
  const SECRET = process.env.PRIVATE_KEY

  return bcrypt.hash(email + password + SECRET, SALT_ROUNDS)
}

async function populateDatabase() {
  try {
    await dataSource.initialize()
    console.log('Data Source has been initialized!')

    const manager = dataSource.manager

    // Import Ingredients
    const ingredients = data.ingredients.map((i) => {
      const ingredient = new Ingredient()
      ingredient.name = i.name
      ingredient.pricePerPackage = i.price_per_package
      ingredient.packagesInStock = i.packages_in_stock
      ingredient.quantityPerPackage = i.quantity_per_package
      ingredient.unit = i.unit as IngredientUnit
      return ingredient
    })
    await manager.save(ingredients)
    console.log('Ingredients imported!')

    // Import Products
    const products = data.products.map((p) => {
      const product = new Product()
      product.name = p.name
      product.price = p.price
      product.quantityInStock = p.quantity_in_stock
      product.quantityReserved = p.quantity_reserved
      product.recipe = p.recipe
      return product
    })
    await manager.save(products)
    console.log('Products imported!')

    // Map Product and Ingredients relationships
    for (const productData of data.product_ingredient) {
      const product = products.find((p) => p.name === productData.product)
      if (!product) {
        console.warn(`Product "${productData.product}" not found`)
        continue
      }

      const ingredientsToAdd = productData.ingredients.map((ingredientName) => {
        const ingredient = ingredients.find((i) => i.name === ingredientName)
        if (!ingredient) {
          console.warn(`Ingredient "${ingredientName}" not found for product "${productData.product}"`)
          return null
        }
        return ingredient
      }).filter((i) => i !== null)

      product.ingredients = ingredientsToAdd
      await manager.save(product)
    }
    console.log('Product-ingredient relationships imported!')

    // Import Packages
    const packages = data.packages.map((pkg) => {
      const packageEntity = new Package()
      packageEntity.name = pkg.name
      packageEntity.price = pkg.price
      packageEntity.quantityInStock = pkg.quantity_in_stock
      return packageEntity
    })
    await manager.save(packages)
    console.log('Packages imported!')

    // Import Users
    const users = await Promise.all(
      data.users.map(async (u) => {
        const user = new User()
        user.roles = u.roles as UserRole[]
        user.email = u.email
        user.passwordHash = await encryptPassword(u.password, u.email)
        return user
      })
    )
    await manager.save(users)
    console.log('Users imported!')

    // Import Customer Info
    const usersCustomerInfo = await manager.find(User)

    const customerInfos = data.customer_infos.map((ci) => {
      const customerInfo = new CustomerInfo()
      customerInfo.name = ci.name
      customerInfo.birthday = ci.birthday
      customerInfo.note = ci.note

      const user = usersCustomerInfo.find((u) => u.id === ci.user_id)
      if (user) {
        customerInfo.user = user
      } else {
        console.warn(`User with ID ${ci.user_id} not found for customer info`)
      }

      return customerInfo
    })

    await manager.save(customerInfos)
    console.log('Customer Info imported!')

    // Import Employee Info
    const usersEmployeeInfo = await manager.find(User)

    const employeeInfos = data.employee_infos.map((ei) => {
      const employeeInfo = new EmployeeInfo()
      employeeInfo.isDeleted = ei.is_deleted
      employeeInfo.name = ei.name
      employeeInfo.salary = ei.salary

      const user = usersEmployeeInfo.find((u) => u.id === ei.user_id)
      if (user) {
        employeeInfo.user = user
      } else {
        console.warn(`User with ID ${ei.user_id} not found for employee info`)
      }

      return employeeInfo
    })

    await manager.save(employeeInfos)
    console.log('Employee Info imported!')

    // Import Orders
    for (const o of data.orders) {
      const order = new Order()
      const shippingPackage = packages.find((pkg) => pkg.name === o.package)
      const customer = users.find((u) => u.id === o.customer_id)

      if (shippingPackage) {
        order.package = shippingPackage
      } else {
        console.warn(`Package "${o.package}" not found for order ${o.total_price}`)
      }

      if (customer) {
        order.customer = customer
      } else {
        console.warn(`Customer with id "${o.customer_id}" not found for order ${o.total_price}`)
      }

      order.totalPrice = o.total_price
      order.paymentTicket = o.paymentTicket
      order.status = o.status as OrderStatus
      order.deliveryDate = o.delivery_date
      order.deliveryAddress = o.delivery_address
      order.customerPhone = o.customer_phone
      await manager.save(order)

      const orderItems = o.order_items.map((oi) => {
        const orderItem = new OrderItem()
        orderItem.order = order
        const product = products.find((p) => p.name === oi.product)
        if (product) {
          orderItem.product = product
        } else {
          console.warn(`Product "${oi.product}" not found for order item`)
        }
        orderItem.quantity = oi.quantity
        orderItem.price = oi.price
        return orderItem
      })
      await manager.save(orderItems)
    }
    console.log('Orders imported!')

    // Import Payments
    const payments = data.payments.map((p) => {
      const payment = new Payment()
      payment.category = p.category as PaymentCategory
      payment.amount = p.amount
      payment.date = p.date
      return payment
    })
    await manager.save(payments)
    console.log('Payments imported!')

    console.log('Database populated successfully!')
  } catch (error) {
    console.error('Error populating database:', error)
  } finally {
    await dataSource.destroy()
  }
}

populateDatabase()
