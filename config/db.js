const mongoose = require('mongoose')
const config = require('../config')
const logger = require('../utils/logger')

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI)
    logger.info('MongoDB Connected')
  } catch (error) {
    logger.error('MongoDB connection failed', error)
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1)
    }
  }
}

module.exports = connectDB
