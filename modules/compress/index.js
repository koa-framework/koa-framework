const compress = require('koa-compress')

module.exports = (app) => {
  app.middlewares.compress = compress(app.config.compress)
}