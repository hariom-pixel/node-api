// Load env variables
require('dotenv').config()

process.env.NODE_ENV = 'test'

const request = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const { client } = require('../config/redis')

let token
let email

// Setup before all tests
beforeAll(async () => {
  // connect DB
  await connectDB()

  // connect Redis
  if (!client.isOpen) {
    await client.connect()
  }

  // dynamic email to avoid duplicate error
  email = `test${Date.now()}@example.com`

  // register user
  await request(app).post('/users/register').send({
    name: 'Test User',
    email,
    password: '123456',
    role: 'user',
  })

  // login user
  const res = await request(app).post('/users/login').send({
    email,
    password: '123456',
  })

  token = res.body.accessToken
}, 15000) // increased timeout

// Test cases
describe('User API', () => {
  it('should get all users (protected route)', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('users')
  })
})

// Cleanup after tests
afterAll(async () => {
  await mongoose.connection.close()

  if (client.isOpen) {
    await client.quit()
  }
  await new Promise((resolve) => setTimeout(resolve, 500))
})
