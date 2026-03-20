// utils/cache.js
const { delKeys } = require('./safeRedis')

const clearUsersCache = async () => {
  await delKeys('users:*')
}

module.exports = { clearUsersCache }
