exports.index = async (ctx) => {
  ctx.loggers.home.info('enter')
  ctx.type = 'html'
  ctx.body = `<h1>Hello, world!</h1>`
}
