import { NotFoundError } from '~/_shared/errors'
import Dish from '~/types/dish'
import { IDishRepository } from '.'

export default class InMemoDishRepository implements IDishRepository {
  dishes = [] as Dish[]
  constructor() {}

  public async get(): Promise<Dish[]> {
    return this.dishes
  }

  public async getById(id: number): Promise<Dish> {
    const dish = this.dishes.find((d) => d.id === id)
    if (!dish) {
      throw new NotFoundError(`dish not founded for id: ${id}`)
    }

    return dish
  }

  public async create(dish: Dish): Promise<{ id: number }> {
    const id = Number(new Date().getTime())
    this.dishes.push({
      id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
    })

    return { id }
  }
}
