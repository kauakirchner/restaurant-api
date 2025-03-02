import { FastifyInstance } from 'fastify'
import { ICustomerController } from '../controllers/customers'

interface IRoutes {
  initRoutes(server: FastifyInstance): void
}

export default class Routes implements IRoutes {
  constructor(private readonly customerController: ICustomerController) {}

  initRoutes(server: FastifyInstance): void {
    server.register(this.customerController.handler, {
      prefix: '/api/customers',
    })

    server.register(
      (server) =>
        server.get('/', (req, reply) =>
          reply.send({ message: 'chegou a request' }),
        ),
      { prefix: '/api/test' },
    )
  }
}
