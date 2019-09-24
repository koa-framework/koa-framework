module.exports = (app) => {
  const logger = app.getFileLogger(__filename)
  return async (ctx, next) => {
    logger.info(ctx.method, ctx.url)
    await next()
  }
}