require('dotenv').config()

const app = require('./app')
const connectDB = require('./config/db')
const { connectRedis } = require('./config/redis')

connectDB()
connectRedis()

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
