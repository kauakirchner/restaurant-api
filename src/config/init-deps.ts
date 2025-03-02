import { FastifyInstance } from 'fastify'
import { Knex } from 'knex'
import { InternalServerError } from '../_shared/errors'
import CustomerController from '../controllers/customers'
import CustomerRepository from '../repositories/customers'
import CustomerService from '../services/customers'
import Database from './knex'

export default class InitDependencies {
  constructor(private readonly server: FastifyInstance) {}

  public initControllers(db: Knex) {
    return {
      customerController: this.initCustomerController(db),
    }
  }

  initCustomerController(db: Knex) {
    const customerRepository = new CustomerRepository(db)
    const customerService = new CustomerService(customerRepository)
    const customerController = new CustomerController(customerService)
    return customerController
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
