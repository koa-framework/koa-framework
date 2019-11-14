const bodyparser = require('koa-bodyparser')

module.exports = (app) => {
  app.middlewares.bodyparser = bodyparser(app.config.bodyparser)
}
