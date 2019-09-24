const fs = require('fs')
const path = require('path')
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

  app.require = (id) => require(path.join(app.root, 'modules', id))

  // cb(filemodule, filebasename)
  app.$load_dir = (dirname, cb) => {
    const dirpath = path.join(app.root, dirname)
    if (!fs.existsSync(dirpath)) return
    const stat = fs.statSync(dirpath)
    if (!stat.isDirectory()) return
    fs.readdirSync(dirpath).forEach((file) => {
      const ext = path.extname(file)
      const filename = path.basename(file, ext)
      if (ext !== '.js') return
      try {
        cb(require(path.join(dirpath, file)), filename)
      } catch(e) {
        app.coreLogger.error(`load file "${dirname}/${file}" error:`, e)
      }
    })
  }
  // cb(filemodule)
  app.$load_file = (filename, cb) => {
    const filepath = path.join(app.root, filename)
    const stat = fs.statSync(filepath)
    if (!stat.isFile()) return
    if (path.extname(filename) !== '.js') return
    try {
      cb(require(filepath))
    } catch(e) {
      app.coreLogger.error(`load file "${filename}" error:`, e)
    }
  }

  app.$load_plugin = (id) => {
    try {
      const plugin = require(id)
      if (typeof plugin !== 'function') {
        app.coreLogger.error(`插件无法加载，应暴露函数：${id}`)
        return
      }
      plugin(app)
    } catch (e) {
      app.coreLogger.error(`加载插件失败：${id}`, e)
    }
  }
}
