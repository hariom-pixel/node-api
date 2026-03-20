// routes/healthRoutes.js
const express = require('express')
const router = express.Router()
const { client } = require('../config/redis')
const mongoose = require('mongoose')

router.get('/health', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'up' : 'down'
  const redisStatus = client && client.isReady ? 'up' : 'down'

  res.json({
    status: 'ok',
    mongo: mongoStatus,
    redis: redisStatus,
  })
})

module.exports = router
