const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node API',
      version: '1.0.0',
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://node-api-3i98.onrender.com'
            : 'http://localhost:3001',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },

    security: [{ bearerAuth: [] }], // ✅ GLOBAL AUTH
  },

  apis: ['./routes/*.js'],
}

const specs = swaggerJsdoc(options)

module.exports = specs
