require('dotenv').config()

module.exports = {
  client: process.env.DB_CLIENT || 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ||  5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'somePassword',
    database: process.env.DB_DATABASE || 'test_db'
  },
}
