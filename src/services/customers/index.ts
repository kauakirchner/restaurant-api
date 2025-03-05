import { InternalServerError } from '../../_shared/errors'
import logger from '../../config/logger'
import Customer from '../../types/customer'
import { ICustomerRepository } from '../../repositories/customers'

export interface ICustomerService {
  get(): Promise<Customer[]>
  getById(id: number): Promise<Customer>
  create(customer: Customer): Promise<{ id: number }>
}

export default class CustomerService implements ICustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  public async get(): Promise<Customer[]> {
    logger.info('Init getCustomers service')
    const response = this.customerRepository.get()
    logger.info('getCustomers service executed succesfully')
    return response
  }

  public async getById(id: number): Promise<Customer> {
    logger.info('Init getCustomerById service')
    const response = await this.customerRepository.getById(id)

    logger.info('getCustomerById service executed succesfully')
    return response
  }

  public async create(customer: Customer): Promise<{ id: number }> {
    logger.info('Init createCustomer service')
    const response = await this.customerRepository.create(customer)

    if (!response.id) {
      logger.error(`error creating customer ${customer.email}`)
      throw new InternalServerError()
    }
    logger.info('createCustomer service executed succesfully')
    return response
  }
}
