const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
  })

  const statusCode = err.statusCode || 500
  const message = err.message || 'Something went wrong'

  res.status(statusCode).json({
    status: 'error',
    message,
  })
}

module.exports = errorHandler
