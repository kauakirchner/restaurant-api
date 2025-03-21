import { Knex } from 'knex'
import { NotFoundError } from '~/_shared/errors'
import logger from '~/config/logger'
import User from '~/types/user'

export interface IUserRepository {
  get(): Promise<User[]>
  getById(id: number): Promise<User>
  delete(id: number): Promise<number>
  create(user: User): Promise<{ id: number }>
}

export default class UserRepository implements IUserRepository {
  constructor(private readonly db: Knex<User>) {}

  get(): Promise<User[]> {
    logger.info('Init getUsers repository')
    const response = this.db('users').select('*')
    logger.info('getUsers repository executed succesfully')
    return response
  }

  async getById(id: number): Promise<User> {
    logger.info('Init getUserById repository')
    const response = await this.db('users').where({ id }).first()
    if (!response) {
      logger.error(
        {
          error: `user not founded for id: ${id}`,
        },
        'error getUserById repository',
      )
      throw new NotFoundError(`user not founded for id: ${id}`)
    }

    return response
  }

  delete(id: number): Promise<number> {
    logger.info('Init deleteUser repository')
    const response = this.db('users').where({ id }).del()
    logger.info('deleteUser repository executed')
    return response
  }

  create(user: User): Promise<{ id: number }> {
    logger.info('Init createUser repository')
    const response = this.db('users')
      .insert({
        email: user.email,
        id: user.id,
        password_hash: user.password_hash,
      })
      .returning('id')
      .first()

    logger.info('Init createUser repository')
    return response
  }
}
