import { NotFoundError } from '~/_shared/errors'
import { IUserRepository } from '~/repositories/users'
import User from '~/types/user'

export interface IUserService {
  get(): Promise<User[]>
  getById(id: number): Promise<User>
  create(user: User): Promise<{ id: number }>
  delete(id: number): Promise<number>
}

export default class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  get(): Promise<User[]> {
    return this.userRepository.get()
  }

  getById(id: number): Promise<User> {
    return this.userRepository.getById(id)
  }

  create(user: User): Promise<{ id: number }> {
    return this.userRepository.create(user)
  }

  async delete(id: number): Promise<number> {
    const response = await this.userRepository.getById(id)
    if (!response) {
      throw new NotFoundError(`user not founded for id: ${id}`)
    }
    return this.userRepository.delete(id)
  }
}
