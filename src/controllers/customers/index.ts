import { FastifyInstance } from 'fastify'
import { ICustomerService } from '../../services/customers'
import Customer from '../../entities/customer'

export interface ICustomerController {
  get(): Promise<Customer[]>
  getById(id: number): Promise<Customer>
  create(customer: Customer): Promise<Customer>
  handler(server: FastifyInstance): Promise<void>
}

export default class CustomerController implements ICustomerController {
  constructor(private readonly customerService: ICustomerService) {}

  public async handler(server: FastifyInstance): Promise<void> {
    server.get('/', async () => {
      return this.get()
    })

    server.get('/:id', async (request) => {
      return this.getById(request.params as number)
    })

    server.post('/', async (request) => {
      return this.create(request.body as Customer)
    })
  }

  public async get(): Promise<Customer[]> {
    return this.customerService.get()
  }

  public async getById(id: number): Promise<Customer> {
    return this.customerService.getById(id)
  }

  public async create(customer: Customer): Promise<Customer> {
    return this.customerService.create(customer)
  }
}
