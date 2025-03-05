import { InternalServerError } from '../../_shared/errors'
import logger from '../../config/logger'
import Order from '../../types/order'
import { IOrderRepository } from '../../repositories/orders'

export interface IOrderService {
  get(): Promise<Order[]>
  getById(id: number): Promise<Order[]>
  create(order: Order): Promise<{ id: number }>
}

export default class OrderService implements IOrderService {
  constructor(private readonly orderRepository: IOrderRepository) {}

  public async get(): Promise<Order[]> {
    logger.info('Init getOrders service')
    const response = this.orderRepository.get()
    logger.info('getOrders service executed succesfully')
    return response
  }

  public async getById(id: number): Promise<Order[]> {
    logger.info('Init getOrderById service')
    const response: Order[] = await this.orderRepository.getById(id)

    logger.info('getOrderById service executed succesfully')
    return response
  }

  public async create(order: Order): Promise<{ id: number }> {
    logger.info('Init createOrder service')
    const response = await this.orderRepository.create(order)

    if (!response.id) {
      logger.error(`error creating order from customer ${order.customer_id}`)
      throw new InternalServerError()
    }
    logger.info('createOrder service executed succesfully')
    return response
  }
}
