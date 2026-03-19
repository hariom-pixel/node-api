const { client } = require('../config/redis')

const clearUsersCache = async () => {
  const keys = await client.keys('users:*')
  if (keys.length) {
    await client.del(keys)
  }
}

module.exports = {
  clearUsersCache,
}
