import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import Dish from '~/types/dish'
import { IDishService } from '~/services/dishes'

export interface IDishController {
  get(request: FastifyRequest, reply: FastifyReply): Promise<void>
  getById(request: FastifyRequest, reply: FastifyReply): Promise<void>
  create(request: FastifyRequest, reply: FastifyReply): Promise<void>
  handler(server: FastifyInstance): Promise<void>
}

export default class DishController implements IDishController {
  constructor(private readonly dishService: IDishService) {
    this.handler = this.handler.bind(this)
  }

  public async handler(server: FastifyInstance): Promise<void> {
    server.log.info('Init DishController')

    server.get('/', (request, reply) => this.get(request, reply))
    server.get<{ Params: { id: number } }>('/:id', (request, reply) =>
      this.getById(request, reply),
    )
    server.post<{ Body: Dish }>('/', (request, reply) =>
      this.create(request, reply),
    )
  }

  async get(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const response: Dish[] = await this.dishService.get()

      return reply.status(200).send(response)
    } catch (error) {
      request.log.error(`error at getDishes: ${error.message}`)
      reply.status(error.statusCode).send({ error })
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params as { id: number }

      const response: Dish = await this.dishService.getById(id)

      reply.status(200).send(response)
    } catch (error: any) {
      request.log.error(`error at getDishById: ${error.message}`)
      reply
        .status(error.statusCode ?? 500)
        .send({ error: error ?? 'unexpected error' })
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const dish = request.body as Dish
      const response: { id: number } = await this.dishService.create(dish)

      return reply.status(201).send(response)
    } catch (error) {
      request.log.error(`error at createDish: ${error.message}`)
      reply.status(error.statusCode ?? 500).send({ error })
    }
  }
}
