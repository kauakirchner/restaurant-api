import { Knex } from 'knex'
import { NotFoundError } from '../../_shared/errors'
import logger from '../../config/logger'
import Dish from '../../types/dish'

export interface IDishRepository {
  get(): Promise<Dish[]>
  getById(id: number): Promise<Dish>
  create(dish: Dish): Promise<{ id: number }>
}

export default class DishRepository implements IDishRepository {
  constructor(private readonly db: Knex<Dish>) {}

  public get(): Promise<Dish[]> {
    logger.info('Init getDishes repository')
    const response = this.db('dishes').select('*')
    logger.info('getDishes repository executed succesfully')
    return response
  }

  public async getById(id: number): Promise<Dish> {
    logger.info('Init getDisheById repository')
    const response = await this.db<Dish>('dishes').where('id', id).first()

    if (!response || !response.id) {
      logger.error(
        {
          error: `dish not founded for id: ${id}`,
        },
        'error getDisheById repository',
      )
      throw new NotFoundError(`Dish not founded for id: ${id}`)
    }

    logger.info('getDisheById repository executed succesfully')
    return response
  }

  public create(dish: Dish): Promise<{ id: number }> {
    const response = this.db('dishes')
      .insert({
        description: dish.description,
        name: dish.name,
        price: dish.price,
      })
      .returning('id')
      .first()

    logger.info('createDish repository executed succesfully')
    return response
  }
}
