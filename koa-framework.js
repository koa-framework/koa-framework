const koa = require('koa')
const Router = require('koa-trie-router')
const extend = require('./extend')

module.exports = (root, config) => {
  const app = new koa()

  app.root = root
  app.config = config

  extend(app)

  app.$load_dir('extend', (extend) => extend(app))

  app.service = app.context.service = {}
  app.$load_dir('service', (mod, name) => app.service[name] = mod(app))
  app.middlewares = {} // `middleware` 与 Koa 对象原有属性重名
  app.$load_dir('middleware', (mod, name) => app.middlewares[name] = mod(app))
  app.interceptor = {}
  app.$load_dir('interceptor', (mod, name) => app.interceptor[name] = mod(app))
  app.controller = {}
  app.$load_dir('controller', (mod, name) => {
    if (typeof mod === 'function') {
      app.controller[name] = mod(app)
    } else {
      app.controller[name] = mod
    }
  })

  app.router = new Router()
  app.$load_file('router.js', (fn) => fn(app))
  app.use(app.router.middleware())

  // 加载插件
  if (Array.isArray(config.plugins)) {
    for (let plugin of config.plugins) {
      app.$load_plugin(plugin)
    }
  }

  return app
}
