import { FastifyInstance } from 'fastify'
import { ICustomerController } from '../controllers/customers'
import { IOrderController } from '../controllers/orders'

interface IRoutes {
  initRoutes(server: FastifyInstance): void
}

export default class Routes implements IRoutes {
  constructor(
    private readonly customerController: ICustomerController,
    private readonly orderController: IOrderController,
  ) {}

  initRoutes(server: FastifyInstance): void {
    server.register(this.customerController.handler, {
      prefix: '/api/customers',
    })
    server.register(this.orderController.handler, { prefix: '/api/orders' })
  }
}
