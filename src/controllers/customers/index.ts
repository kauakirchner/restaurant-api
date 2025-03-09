import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { ICustomerService } from '../../services/customers'
import Customer from '../../types/customer'

export interface ICustomerController {
  get(request: FastifyRequest, reply: FastifyReply): Promise<void>
  getById(request: FastifyRequest, reply: FastifyReply): Promise<void>
  create(request: FastifyRequest, reply: FastifyReply): Promise<void>
  handler(server: FastifyInstance): Promise<void>
}

export default class CustomerController implements ICustomerController {
  constructor(private readonly customerService: ICustomerService) {
    this.handler = this.handler.bind(this)
  }

  public async handler(server: FastifyInstance): Promise<void> {
    server.log.info('Init customerController')

    server.get('/', (request, reply) => this.get(request, reply))
    server.get<{ Params: { id: number } }>('/:id', (request, reply) =>
      this.getById(request, reply),
    )
    server.post<{ Body: Customer }>('/', (request, reply) =>
      this.create(request, reply),
    )
  }

  async get(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const response: Customer[] = await this.customerService.get()

      return reply.status(200).send(response)
    } catch (error) {
      request.log.error(`error at getCustomers: ${error.message}`)
      reply.status(error.statusCode).send({ error })
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params as { id: number }

      const response: Customer = await this.customerService.getById(id)

      reply.status(200).send(response)
    } catch (error: any) {
      request.log.error(`error at getCustomerById: ${error.message}`)
      reply
        .status(error.statusCode ?? 500)
        .send({ error: error ?? 'unexpected error' })
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const customer = request.body as Customer
      const response: { id: number } =
        await this.customerService.create(customer)

      return reply.status(201).send(response)
    } catch (error) {
      request.log.error(`error at createCustomer: ${error.message}`)
      reply.status(error.statusCode ?? 500).send({ error })
    }
  }
}
