import { initializeTracing } from './lib/opentelemetry.js'
initializeTracing()

import Fastify, { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

import Database from './lib/knex.js'
import { Routes } from './routes/index.js'
import CustomerController from './controllers/customers/index.js'
import CustomerService from './services/customers/index.js'
import { CustomerRepository } from './repositories/customers/index.js'
import { Knex } from 'knex'

const server: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>()

server.get('/', async () => {
  return { hello: 'world' }
})

const getDatabse = () => {
  Database.setup()
  return Database.getInstance()
}

const initDependencies = (db: Knex) => {
  const customerRepository = new CustomerRepository(db)
  const customerService = new CustomerService(customerRepository)
  const customerController = new CustomerController(customerService)
  return customerController
}

const start = async () => {
  try {
    Database.setup()
    const db = Database.getInstance()
    if (process.env.NODE_ENV === 'development') {
      await Database.seedDb()
    }
    initDependencies(db)
    const routes = new Routes()

    await server.listen({ port: 3000 })
    const address = server.server.address()
    const port = typeof address === 'object' ? address?.port : address
    console.log(`Server listening on port ${port}`)
  } catch (err) {
    server.log.error('err initializing application', err)
    process.exit(1)
  }
}

start()
