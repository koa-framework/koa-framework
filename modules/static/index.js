const _static = require('koa-static')

module.exports = (app) => {
  const { root, ...opts } = app.config.static
  app.middlewares.static = _static(root, opts)
}
