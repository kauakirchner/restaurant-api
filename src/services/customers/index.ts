import Customer from '../../entities/customer'
import { ICustomerRepository } from '../../repositories/customers'

export interface ICustomerService {
  get(): Promise<Customer[]>
  getById(id: number): Promise<Customer>
  create(customer: Customer): Promise<Customer>
}

export default class CustomerService implements ICustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  public async get(): Promise<Customer[]> {
    return this.customerRepository.get()
  }

  public async getById(id: number): Promise<Customer> {
    return this.customerRepository.getById(id)
  }

  public async create(customer: Customer): Promise<Customer> {
    return this.customerRepository.create(customer)
  }
}
