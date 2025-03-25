import Order from '~/types/order'
import { NotFoundError } from '~/_shared/errors'
import { IOrderRepository } from '.'

export default class InMemoOrderRepository implements IOrderRepository {
  orders = [] as Order[]

  constructor() {}

  public async get(): Promise<Order[]> {
    return this.orders
  }

  public async getById(id: number): Promise<Order> {
    const order = this.orders.find((o) => o.id === id)
    if (!order) {
      throw new NotFoundError(`order not founded for id: ${id}`)
    }

    return order
  }

  public async create(order: Order): Promise<{ id: number }> {
    const id = Number(new Date().getTime())
    this.orders.push({
      id,
      customer_id: order.customer_id,
      created_at: new Date(),
      note: order.note,
      number: 0,
    })

    return { id }
  }
}
