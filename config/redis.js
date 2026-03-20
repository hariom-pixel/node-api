// config/redis.js
const { createClient } = require('redis')
const logger = require('../utils/logger')

let client = null

if (process.env.REDIS_URL) {
  client = createClient({ url: process.env.REDIS_URL })

  client.on('error', (err) => {
    console.error('Redis error:', err)
  })

  const connectRedis = async () => {
    try {
      await client.connect()
      logger.info('Redis connected')
    } catch (err) {
      logger.error('Redis failed to connect:', err)
      client = null // mark as unavailable
    }
  }

  module.exports = { client, connectRedis }
} else {
  console.log('⚠️ Redis disabled (REDIS_URL not set)')
  module.exports = { client: null, connectRedis: async () => {} }
}
