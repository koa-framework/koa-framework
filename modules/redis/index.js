const Redis = require('ioredis')

module.exports = (app) => {
  const logger = app.getLogger('@luobotang/koa-redis')
  const client = new Redis(app.config.redis)

  logger.debug('client created')
  client.on('error', (err) => logger.error(err))

  const proxy = {} // 缓存 client 的属性

  /**
   * 只代理暴露 redis 客户端对象的方法，例如：
   * - app.redis.get()
   * - app.redis.set()
   * - app.redis.setex()
   * - app.redis.del()
   */
  app.redis = app.context.redis = new Proxy(client, {
    get(client, key) {
      const val = proxy[key]
      if (val !== undefined) return val
      if (typeof client[key] !== 'function') return (proxy[key] = null)
      return (proxy[key] = (...args) => {
        logger.debug('call [' + key + ']')
        logger.trace('call [' + key + ']', ...args)
        return client[key](...args)
      })
    }
  })
}
