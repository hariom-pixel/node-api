const express = require('express')
const rateLimit = require('express-rate-limit')
const swaggerUi = require('swagger-ui-express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const userRoutes = require('./routes/userRoutes')
const healthRoutes = require('./routes/healthRoutes')
const logger = require('./utils/logger')
const errorHandler = require('./middleware/errorHandler')
const requestLogger = require('./middleware/requestLogger')
const specs = require('./config/swagger')

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

// Global middlewares
app.use(limiter)
app.use(express.json())
app.use(helmet())
app.use(cors())

// Request logging
app.use(
  morgan('combined', {
    stream: {
      write: (msg) => logger.info(msg.trim()),
    },
  })
)

app.use(requestLogger)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// Static files
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/users', userRoutes)
app.use('/health', healthRoutes)

// Error handler (LAST)
app.use(errorHandler)

module.exports = app
