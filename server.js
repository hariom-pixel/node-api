// server.js
require('dotenv').config()

const app = require('./app') // your Express app
const connectDB = require('./config/db') // MongoDB connection
const { connectRedis } = require('./config/redis') // optional Redis

const PORT = process.env.PORT || 3001

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB()
    console.log('✅ MongoDB connected')

    // Connect Redis only if REDIS_URL exists
    await connectRedis() // safe no-op if Redis disabled

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  } catch (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
}

startServer()
