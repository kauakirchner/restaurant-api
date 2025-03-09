import { FastifyInstance } from 'fastify'
import { Knex } from 'knex'
import { InternalServerError } from '../_shared/errors'
import CustomerController from '../controllers/customers'
import CustomerRepository from '../repositories/customers'
import CustomerService from '../services/customers'
import Database from './knex'
import OrderRepository from '../repositories/orders'
import OrderService from '../services/orders'
import OrderController from '../controllers/orders'
import DishRepository from '../repositories/dishes'
import DishService from '../services/dishes'
import DishController from '../controllers/dishes'

export default class InitDependencies {
  constructor(private readonly server: FastifyInstance) {}

  public initControllers(db: Knex) {
    return {
      customerController: this.initCustomerController(db),
      orderController: this.initOrderController(db),
      dishController: this.initDishController(db),
    }
  }

  initCustomerController(db: Knex) {
    const customerRepository = new CustomerRepository(db)
    const customerService = new CustomerService(customerRepository)
    const customerController = new CustomerController(customerService)
    return customerController
  }

  initOrderController(db: Knex) {
    const orderRepository = new OrderRepository(db)
    const orderService = new OrderService(orderRepository)
    const orderController = new OrderController(orderService)
    return orderController
  }

  initDishController(db: Knex) {
    const dishRepository = new DishRepository(db)
    const dishService = new DishService(dishRepository)
    const dishController = new DishController(dishService)
    return dishController
  }

  public initDatabse() {
    try {
      this.server.log.info('Init database connection')
      Database.setup()
      const db = Database.getInstance()

      if (process.env.NODE_ENV !== 'production') {
        Database.seedDb()
      }
      this.server.log.info('Database connected succesfully')
      return db
    } catch (error) {
      this.server.log.error(error.message, 'Database connection failed')
      throw new InternalServerError('Database connection failed')
    }
  }
}
