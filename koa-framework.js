const koa = require('koa')
const Router = require('koa-trie-router')

module.exports = (root, config) => {
  const app = new koa()

  app.root = root
  app.config = config
  app.service = app.context.service = {}
  app.middlewares = {} // `middleware` 与 Koa 对象原有属性冲突
  app.interceptor = {}
  app.controller = {}
  app.router = new Router()

  // 加载内置插件
  require('./plugins/logger')(app)
  require('./plugins/loader')(app)

  // 加载应用配置插件
  if (Array.isArray(config.plugins)) {
    for (let plugin of config.plugins) {
      app.$load_plugin(plugin)
    }
  }

  // 记载应用组件
  app.$load_dir('plugin', (m) => m(app))
  app.$load_dir('service', (m, name) => app.service[name] = m(app))
  app.$load_dir('middleware', (m, name) => app.middlewares[name] = m(app))
  app.$load_dir('interceptor', (m, name) => app.interceptor[name] = m(app))
  app.$load_dir('controller', (m, name) => app.controller[name] = typeof m === 'function' ? m(app) : m)

  // 加载路由
  app.$load_file('router.js', (m) => m(app))
  app.use(app.router.middleware())

  return app
}
