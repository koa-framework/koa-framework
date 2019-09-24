module.exports = (app) => {
  const logger = app.getLogger('@luobotang/koa-validator')

  function makeValidateFn(name) {
    logger.debug('创建 validate 函数：', name)
    if (typeof name === 'string') {
      return (data) => {
        const fn = app.validators[name]
        if (typeof fn !== 'function') {
          logger.error('缺少 validator:', name)
          return
        }
        try {
          logger.debug('校验数据：', data, name)
          return fn(data)
        } catch(e) {
          logger.error(e)
          return e.message
        }
      }
    }
    if (Array.isArray(name)) {
      return (data) => {
        try {
          for (let key of name) {
            let fn = app.validators[key]
            if (typeof fn !== 'function') {
              logger.error('缺少 validator:', key)
              continue
            }
            let value = data[key]
            logger.debug('校验数据：', value, key)
            let msg = fn(value)
            if (msg) return msg
          }
        } catch(e) {
          logger.error(e)
          return e.message
        }
      }
    }
    if (name && typeof name === 'object') {
      return (data) => {
        try {
          for (let key of Object.keys(name)) {
            let fn = app.validators[name[key]]
            if (typeof fn !== 'function') {
              logger.error('缺少 validator:', key)
              continue
            }
            let value = data[key]
            logger.debug('校验数据：', value, key, name[key])
            let msg = fn(value)
            if (msg) return msg
          }
        } catch(e) {
          logger.error(e)
          return e.message
        }
      }
    }
    logger.error('不支持的创建类型：', name)
    return () => null
  }

  return (name) =>{
    const validate = makeValidateFn(name)
    return async (ctx, next) => {
      const message = validate(ctx.method === 'POST' ? ctx.request.body : ctx.query)
      if (message) {
        logger.warn(message)
        ctx.throw(403, message)
        return
      }
      return await next()
    }
  }
}
