const koa = require('koa')
const Router = require('koa-trie-router')
const extend = require('./extend')

module.exports = (root, config) => {
  const app = new koa()

  app.root = root
  app.config = config
  app.service = app.context.service = {}
  app.middlewares = {} // `middleware` 与 Koa 对象原有属性冲突
  app.interceptor = {}
  app.controller = {}
  app.router = new Router()

  extend(app)
  if (Array.isArray(config.plugins)) {
    for (let plugin of config.plugins) {
      app.$load_plugin(plugin)
    }
  }

  app.$load_dir('extend', (m) => m(app))
  app.$load_dir('service', (m, name) => app.service[name] = m(app))
  app.$load_dir('middleware', (m, name) => app.middlewares[name] = m(app))
  app.$load_dir('interceptor', (m, name) => app.interceptor[name] = m(app))
  app.$load_dir('controller', (m, name) => app.controller[name] = typeof m === 'function' ? m(app) : m)
  app.$load_file('router.js', (m) => m(app))
  app.use(app.router.middleware())

  return app
}
