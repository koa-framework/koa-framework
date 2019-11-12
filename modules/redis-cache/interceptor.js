module.exports = (app) => {
  const logger = app.getLogger('@luobotang/koa-redis-cache')

  function getCacheKey(ctx, key) {
    const params = ctx.method === 'GET' ? ctx.query : ctx.request.body
    if (typeof key === 'string') return params[key]
    return key || JSON.stringify(params) // 将所有查询参数作为缓存标识
  }

  return {
    // get(group, key, expire_s)
    // get(group, expire_s)
    // get(group)
    get(group, key, expire_s) {
      if (typeof key === 'number' && typeof expire_s === 'undefined') {
        expire_s = key
        key = undefined
      }
      return async (ctx, next) => {
        const cache_key = group + '__' + getCacheKey(ctx, key)
        const data = await app.cache.get(cache_key)
        if (data) {
          logger.debug('match-cache', `cache=${cache_key}`)
          ctx.body = data // eslint-disable-line require-atomic-updates
          return
        }
        await next()
        logger.debug('update-cache', `cache=${cache_key}`)
        await app.cache.set(cache_key, ctx.body, expire_s)
      }
    },
    // del(group, key)
    // del(group)
    del(group, key) {
      return async (ctx, next) => {
        await next()
        const cache_key = group + '__' + getCacheKey(ctx, key)
        logger.debug('delete-cache', `cache=${cache_key}`)
        await app.cache.del(cache_key)
      }
    }
  }
}
