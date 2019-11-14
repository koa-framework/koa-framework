const multer = require('@koa/multer')

module.exports = (app) => {
  app.interceptor.multer = multer(app.config.multer)
}
