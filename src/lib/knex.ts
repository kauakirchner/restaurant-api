import knex, { Knex } from 'knex'

export default class Database {
  private static instance: Knex | null = null

  public static setup() {
    if (!Database.instance) {
      Database.instance = knex({
        client: 'pg',
        connection: process.env.POSTGRES_CONNECTION_STRING,
        searchPath: ['knex', 'public'],
        migrations: {
          directory: '../db/migrations',
        },
      })
    }
  }

  public static getInstance() {
    if (!Database.instance) {
      throw new Error('Database not connected')
    }

    return Database.instance
  }

  public static async destroy() {
    if (Database.instance) {
      await Database.instance.destroy()
      Database.instance = null
    }
  }

  public static async seedDb() {
    const db = Database.instance

    if (!db) {
      throw new Error('Database not connected')
    }

    await db.schema.dropTableIfExists('customers')
    await db.schema.dropTableIfExists('dishes')
    await db.schema.dropTableIfExists('orders')

    await db.schema.createTable('customers', (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('lastname')
      table.string('email')
      table.string('phone')
    })

    await db.schema.createTable('dishes', (table) => {
      table.increments('id').primary()
      table.string('name')
      table.decimal('price', 12, 2)
      table.text('description')
    })

    await db.schema.createTable('orders', (table) => {
      table.increments('id').primary()
      table.integer('number')
      table.timestamp('created_at').defaultTo(db.fn.now())
      table.string('note')

      table
        .foreign('customer_id')
        .references('customers.id')
        .withKeyName('fk_fkey_customers')

      table
        .foreign('dish_id')
        .references('dishes.id')
        .withKeyName('fk_fkey_dishes')
    })

    await this.populateDB(db)
  }

  public static async populateDB(db: Knex) {
    if (!db) {
      throw new Error('Database not connected')
    }

    const customers = [
      {
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
      },
      {
        name: 'Jane',
        lastname: 'Smith',
        email: 'jane@example.com',
        phone: '234-567-8901',
      },
      {
        name: 'Alice',
        lastname: 'Johnson',
        email: 'alice@example.com',
        phone: '345-678-9012',
      },
      {
        name: 'Bob',
        lastname: 'Brown',
        email: 'bob@example.com',
        phone: '456-789-0123',
      },
      {
        name: 'Charlie',
        lastname: 'Davis',
        email: 'charlie@example.com',
        phone: '567-890-1234',
      },
    ]

    const customerIds = await db('customers').insert(customers, ['id'])
    const customerIdList = customerIds.map((row: any) => row.id)

    const dishes = [
      { name: 'Spaghetti', price: 12.99, description: 'Classic Italian pasta' },
      { name: 'Burger', price: 9.99, description: 'Juicy beef burger' },
      { name: 'Salad', price: 7.99, description: 'Fresh garden salad' },
      {
        name: 'Pizza',
        price: 14.99,
        description: 'Cheesy pizza with toppings',
      },
      { name: 'Sushi', price: 19.99, description: 'Assorted sushi platter' },
    ]

    const dishIds = await db('dishes').insert(dishes, ['id'])
    const dishIdList = dishIds.map((row: any) => row.id)

    const orders = [
      {
        number: 1,
        note: 'Extra cheese',
        customer_id: customerIdList[0],
        dish_id: dishIdList[0],
      },
      {
        number: 2,
        note: 'No onions',
        customer_id: customerIdList[1],
        dish_id: dishIdList[1],
      },
      {
        number: 3,
        note: 'Well done',
        customer_id: customerIdList[2],
        dish_id: dishIdList[2],
      },
      {
        number: 4,
        note: 'Gluten-free',
        customer_id: customerIdList[3],
        dish_id: dishIdList[3],
      },
      {
        number: 5,
        note: 'Spicy',
        customer_id: customerIdList[4],
        dish_id: dishIdList[4],
      },
    ]

    await db('orders').insert(orders)
  }
  catch(error) {
    console.error('Error populating database:', error.message)
    throw error
  }
}
