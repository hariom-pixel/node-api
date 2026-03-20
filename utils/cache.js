// utils/cache.js
const { delKeys } = require('./safeRedis')

const clearUsersCache = async () => {
  await delKeys('users:*') // safe even if Redis is disabled
}

module.exports = { clearUsersCache }
