import { Knex } from 'knex'
import Customer from '../../types/customer'
import { NotFoundError } from '../../_shared/errors'
import logger from '../../config/logger'

export interface ICustomerRepository {
  get(): Promise<Customer[]>
  getById(id: number): Promise<Customer>
  create(customer: Customer): Promise<{ id: number }>
}

export default class CustomerRepository implements ICustomerRepository {
  constructor(private readonly db: Knex<Customer>) {}

  public get(): Promise<Customer[]> {
    logger.info('Init getCustomers repository')
    return this.db('customers').select('*')
  }

  public async getById(id: number): Promise<Customer> {
    logger.info('Init getCustomerById repository')
    const response = await this.db<Customer>('customers')
      .where('id', id)
      .first()

    if (!response || !response.id) {
      logger.error(
        {
          error: `customer not founded for id: ${id}`,
        },
        'error getCustomerById repository',
      )
      throw new NotFoundError(`customer not founded for id: ${id}`)
    }

    logger.info('getCustomerById repository executed succesfully')
    return response
  }

  public create(customer: Customer): Promise<{ id: number }> {
    return this.db('customers')
      .insert({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      })
      .returning('id')
      .first()
  }
}
