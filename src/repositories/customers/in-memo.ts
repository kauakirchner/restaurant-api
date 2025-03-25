import Customer from '~/types/customer'
import { ICustomerRepository } from '.'
import { NotFoundError } from '~/_shared/errors'

export default class InMemoCustomerRepository implements ICustomerRepository {
  customers = [] as Customer[]

  constructor() {}

  public async get(): Promise<Customer[]> {
    return this.customers
  }

  public async getById(id: number): Promise<Customer> {
    const customer = this.customers.find((c) => c.id === id)
    if (!customer) {
      throw new NotFoundError(`customer not founded for id: ${id}`)
    }
    return customer
  }

  public async create(customer: Customer): Promise<{ id: number }> {
    const id = Number(new Date().getTime())
    this.customers.push({
      id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    })
    return { id }
  }
}
