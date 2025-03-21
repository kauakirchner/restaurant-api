import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { HttpError } from '~/_shared/errors'
import { IUserService } from '~/services/users'
import User from '~/types/user'

export interface IUserController {
  create(request: FastifyRequest, reply: FastifyReply): Promise<void>
  delete(request: FastifyRequest, reply: FastifyReply): Promise<void>
  get(request: FastifyRequest, reply: FastifyReply): Promise<void>
  getById(request: FastifyRequest, reply: FastifyReply): Promise<void>
  handler(server: FastifyInstance): Promise<void>
}

export default class UserController implements IUserController {
  constructor(private readonly userService: IUserService) {
    this.handler = this.handler.bind(this)
  }
  async handler(server: FastifyInstance) {
    server.log.info('Init userController')

    server.get('/', (request, reply) => {
      this.get(request, reply)
    })

    server.get('/:id', (request, reply) => {
      this.getById(request, reply)
    })

    server.post<{ Body: User }>('/', (request, reply) =>
      this.create(request, reply),
    )
    server.delete<{ Params: { id: number } }>('/:id', (request, reply) =>
      this.delete(request, reply),
    )
  }
  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const response = await this.userService.create(request.body as User)
      request.log.info('createUsersController executed succesfully')
      reply.status(201).send(response)
    } catch (error) {
      const err = error as HttpError
      request.log.error(`error at createUser: ${err.message}`)
      reply.status(err.statusCode).send(err)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: number }
    try {
      const response = await this.userService.delete(id)
      request.log.info('deleteUsersController executed succesfully')
      reply.status(200).send(response)
    } catch (error) {
      const err = error as HttpError
      request.log.error(`error at deleteUser userId: ${id}`, err.message)
      reply.status(err.statusCode).send(err)
    }
  }

  async get(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const response = await this.userService.get()
      request.log.info('getUsersController executed succesfully')
      reply.status(200).send(response)
    } catch (error) {
      request.log.error(`error at getUsers: ${error.message}`)
      reply
        .status(500)
        .send({ error: new HttpError(500, 'Internal Server Error') })
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: number }
    try {
      const response = await this.userService.getById(id)
      request.log.info('getUserById executed succesfully')
      reply.status(200).send(response)
    } catch (error) {
      const err = error as HttpError
      request.log.error(`error at getUserById userId: ${id}`, err.message)
      reply.status(err.statusCode).send(err)
    }
  }
}
