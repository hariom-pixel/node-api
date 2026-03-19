const env = process.env.NODE_ENV || 'development'

const config = {
  env,
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  redisURL: process.env.REDIS_URL,
}

module.exports = config
