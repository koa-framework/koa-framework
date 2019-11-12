module.exports = (app) => {
  const logger = app.getLogger('@luobotang/koa-redis-cache')
  const { prefix } = app.config.cache || {}
  const PREFIX = prefix ? prefix + '__' : ''

  const cache = app.cache = app.context.cache = {
    async get(key) {
      logger.debug('get', `key=${key}`)
      const data = await app.redis.get(PREFIX + key)
      if (!data) {
        logger.debug('unmatch', `key=${key}`)
        return
      }
      logger.debug('match', `key=${key}`)
      return JSON.parse(data)
    },
    // 缺省缓存24小时
    async set(key, data, expire_s = 24 * 3600) {
      logger.debug('set', `key=${key}`, `expire_s=${expire_s}`)
      await app.redis.setex(PREFIX + key, expire_s, JSON.stringify(data))
    },
    async del(key) {
      logger.debug('del', `key=${key}`)
      await app.redis.del(PREFIX + key)
    }
  }

  cache.getOrSet = async (key, getData, expire_s) => {
    const old_data = await cache.get(key)
    if (old_data !== null) return old_data
    const new_data = await getData()
    cache.set(key, new_data, expire_s)
    return new_data
  }

  app.interceptor.cache = require('./interceptor')(app)
}
