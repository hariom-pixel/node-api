const { createClient } = require('redis')

let client = null

// Only create client if REDIS_URL is set
if (process.env.REDIS_URL) {
  client = createClient({ url: process.env.REDIS_URL })

  client.on('error', (err) => {
    console.error('Redis error:', err)
  })

  const connectRedis = async () => {
    try {
      await client.connect()
      console.log('Redis connected')
    } catch (err) {
      console.error('Redis failed to connect:', err)
    }
  }

  module.exports = { client, connectRedis }
} else {
  console.log('Redis disabled (REDIS_URL not set)')
  module.exports = { client: null, connectRedis: async () => {} }
}
