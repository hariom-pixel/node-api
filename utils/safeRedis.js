// utils/safeRedis.js
const { client } = require('../config/redis')

const get = async (key) => {
  if (!client) return null
  try {
    return await client.get(key)
  } catch (err) {
    console.error('Redis GET error:', err)
    return null
  }
}

const setEx = async (key, ttl, value) => {
  if (!client) return
  try {
    await client.setEx(key, ttl, value)
  } catch (err) {
    console.error('Redis SETEX error:', err)
  }
}

const delKeys = async (pattern) => {
  if (!client) return
  try {
    const keys = await client.keys(pattern)
    if (keys.length) await client.del(keys)
  } catch (err) {
    console.error('Redis DEL error:', err)
  }
}

module.exports = { get, setEx, delKeys }
