import { Knex } from 'knex'
import Order from '../../types/order'
import { NotFoundError } from '../../_shared/errors'
import logger from '../../config/logger'

export interface IOrderRepository {
  get(): Promise<Order[]>
  getById(id: number): Promise<Order[]>
  create(order: Order): Promise<{ id: number }>
}

export default class OrderRepository implements IOrderRepository {
  constructor(private readonly db: Knex<Order>) {}

  public async get(): Promise<Order[]> {
    logger.info('Init getOrders repository')
    const response = await this.db('customers as c')
      .select(
        'c.id as customer_id',
        'c.name as customer_name',
        'c.lastname as customer_lastname',
        'p.id as order_id',
        'p.created_at',
        this.db.raw('SUM(pp.quantity * pr.price) AS amount'),
        this.db.raw(`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'dish_id', pr.id,
            'dish_name', pr.name,
            'quantity', pp.quantity
          )
        ) AS dishes
      `),
      )
      .join('orders as p', 'c.id', 'p.customer_id')
      .join('orders_dishes as pp', 'p.id', 'pp.order_id')
      .join('dishes as pr', 'pp.dish_id', 'pr.id')
      .groupBy('c.id', 'c.name', 'c.lastname', 'p.id', 'p.created_at')
      .orderBy('c.id', 'asc')
      .orderBy('p.id', 'asc')

    logger.info('getOrders repository executed succesfully')
    return response
  }

  public async getById(id: number): Promise<Order[]> {
    logger.info('Init getOrderById repository')
    const response = await this.db('customers as c')
      .select(
        'c.id as customer_id',
        'c.name as customer_name',
        'c.lastname as customer_lastname',
        'p.id as order_id',
        'p.created_at',
        this.db.raw('SUM(pp.quantity * pr.price) AS amount'),
        this.db.raw(`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'dish_id', pr.id,
            'dish_name', pr.name,
            'quantity', pp.quantity
          )
        ) AS dishes
      `),
      )
      .join('orders as p', 'c.id', 'p.customer_id')
      .join('orders_dishes as pp', 'p.id', 'pp.order_id')
      .join('dishes as pr', 'pp.dish_id', 'pr.id')
      .where('p.id', id)
      .groupBy('c.id', 'c.name', 'c.lastname', 'p.id', 'p.created_at')
      .orderBy('c.id', 'asc')
      .orderBy('p.id', 'asc')

    if (!response.length) {
      logger.error(
        {
          error: `order not founded for id: ${id}`,
        },
        'error getOrderById repository',
      )
      throw new NotFoundError(`order not founded for id: ${id}`)
    }

    logger.info('getOrderById repository executed succesfully')

    return response
  }

  public create(order: Order): Promise<{ id: number }> {
    return this.db('orders')
      .insert({
        created_at: new Date(),
        customer_id: order.customer_id,
        note: order.note,
        number: new Date().getTime(),
      })
      .returning('id')
      .first()
  }
}
