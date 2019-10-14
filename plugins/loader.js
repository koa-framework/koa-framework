const fs = require('fs')
const path = require('path')

module.exports = (app) => {
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
