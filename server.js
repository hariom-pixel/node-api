// server.js
require('dotenv').config()

const app = require('./app')
const connectDB = require('./config/db')
const { connectRedis } = require('./config/redis')
const logger = require('./utils/logger')

const PORT = process.env.PORT || 3001

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB()
    logger.info('MongoDB connected')

    // Connect Redis only if REDIS_URL exists
    await connectRedis()

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  } catch (err) {
    logger.error('Failed to start server:', err)
    process.exit(1)
  }
}

startServer()
