import { InternalServerError } from '../../_shared/errors'
import logger from '../../config/logger'
import Dish from '../../types/dish'
import { IDishRepository } from '../../repositories/dishes'

export interface IDishService {
  get(): Promise<Dish[]>
  getById(id: number): Promise<Dish>
  create(dish: Dish): Promise<{ id: number }>
}

export default class DishService implements IDishService {
  constructor(private readonly dishRepository: IDishRepository) {}

  public async get(): Promise<Dish[]> {
    logger.info('Init getDishes service')
    const response = this.dishRepository.get()
    logger.info('getDishes service executed succesfully')
    return response
  }

  public async getById(id: number): Promise<Dish> {
    logger.info('Init getDishById service')
    const response = await this.dishRepository.getById(id)
    logger.info('getDishById service executed succesfully')
    return response
  }

  public async create(dish: Dish): Promise<{ id: number }> {
    logger.info('Init createDish service')
    const response = await this.dishRepository.create(dish)

    if (!response.id) {
      logger.error(`error creating dish ${dish.name}`)
      throw new InternalServerError()
    }
    logger.info('createDish service executed succesfully')
    return response
  }
}
