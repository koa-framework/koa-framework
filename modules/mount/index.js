const mount = require('koa-mount')

module.exports = (app) => {
  // 匹配 - 改写路径 - 执行 - 恢复路径
  app.router.mount = (path, ...middlewares) => {
    app.router.use(mount(path, ...middlewares))
  }
  // 匹配 - 执行
  app.router.match = (path, middleware) => async (ctx, next) => {
    if (ctx.path.startsWith(path)) {
      await middleware(ctx, next)
      return
    }
    await next()
  }
}
