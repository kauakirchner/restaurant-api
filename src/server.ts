import { initializeTracing } from './config/opentelemetry'
initializeTracing()

import dotenv from 'dotenv'
import Fastify, { FastifyInstance } from 'fastify'
import Routes from './routes'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import InitDependencies from './config/init-deps'

dotenv.config({
  path: '.env',
})

const server: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>()

server.setErrorHandler((error, _request, reply) => {
  server.log.error(error)
  reply.status(500).send({ error: 'Something went wrong' })
})

const start = async () => {
  try {
    const config = new InitDependencies(server)
    const db = config.initDatabse()

    const { customerController, orderController } = config.initControllers(db)
    const routes = new Routes(customerController, orderController)

    routes.initRoutes(server)

    await server.listen({ port: 3000 })
    const address = server.server.address()
    const port = typeof address === 'object' ? address?.port : address
    server.log.info(`Server listening on port ${port}`)
  } catch (err) {
    server.log.error(err.message, 'err initializing application')
    process.exit(1)
  }
}

start()
