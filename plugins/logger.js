const log4js = require('log4js')

module.exports = (app) => {
  if (app.config.log4js) {
    log4js.configure(app.config.log4js)
  }

  const loggers = {
    app: log4js.getLogger('app')
  }

  app.coreLogger = loggers.app

  app.log = app.context.log = (...args) => app.coreLogger.info(...args)

  app.getLogger = app.context.getLogger = (category) => loggers[category] || (loggers[category] = log4js.getLogger(category))

  // e.g. getFileLogger(__filename)
  app.getFileLogger = app.context.getFileLogger = (filename, category) => {
    // 只保留相对路径，且去除后缀(.js)
    return log4js.getLogger(category || filename.slice(app.root.length + 1, -3))
  }

  app.loggers = app.context.loggers = new Proxy(loggers, {
    get(target, key) {
      return target[key] || (target[key] = log4js.getLogger(key))
    }
  })
}