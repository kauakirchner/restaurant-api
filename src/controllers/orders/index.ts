import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { IOrderService } from '~/services/orders'
import Order from '~/types/order'

export interface IOrderController {
  get(request: FastifyRequest, reply: FastifyReply): Promise<void>
  getById(request: FastifyRequest, reply: FastifyReply): Promise<void>
  create(request: FastifyRequest, reply: FastifyReply): Promise<void>
  handler(server: FastifyInstance): Promise<void>
}

export default class OrderController implements IOrderController {
  constructor(private readonly orderService: IOrderService) {
    this.handler = this.handler.bind(this)
  }

  public async handler(server: FastifyInstance): Promise<void> {
    server.log.info('Init orderController')

    server.get('/', (request, reply) => this.get(request, reply))
    server.get<{ Params: { id: number } }>('/:id', (request, reply) =>
      this.getById(request, reply),
    )
    server.post<{ Body: Order }>('/', (request, reply) =>
      this.create(request, reply),
    )
  }

  async get(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const response: Order[] = await this.orderService.get()

      return reply.status(200).send(response)
    } catch (error) {
      request.log.error(`error at getOrders: ${error.message}`)
      reply.status(error.statusCode).send({ error })
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params as { id: number }

      const response: Order[] = await this.orderService.getById(id)

      reply.status(200).send(response)
    } catch (error: any) {
      request.log.error(`error at getOrderById: ${error.message}`)
      reply
        .status(error.statusCode ?? 500)
        .send({ error: error ?? 'unexpected error' })
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const order = request.body as Order
      const response = await this.orderService.create(order)

      return reply.status(201).send(response)
    } catch (error) {
      request.log.error(`error at createOrder: ${error.message}`)
      reply.status(error.statusCode ?? 500).send({ error })
    }
  }
}
