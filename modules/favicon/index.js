const favicon = require('koa-favicon')

module.exports = (app) => {
  app.middlewares.favicon = favicon(app.config.favicon)
}
