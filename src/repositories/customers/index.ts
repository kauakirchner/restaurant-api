import { Knex } from 'knex'
import Customer from '../../entities/customer'

export interface ICustomerRepository {
  get(): Promise<Customer[]>
  getById(id: number): Promise<Customer>
  create(customer: Customer): Promise<Customer>
}

export class CustomerRepository implements ICustomerRepository {
  constructor(db: Knex) {}

  public async get(): Promise<Customer[]> {
    return [] as Customer[]
  }

  public async getById(id: number): Promise<Customer> {
    return {} as Customer
  }

  public async create(customer: Customer): Promise<Customer> {
    return customer
  }
}
