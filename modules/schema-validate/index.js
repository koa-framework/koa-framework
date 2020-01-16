const { SchemaModel, T } = require('@luobotang/schema-validate')
const pkg = require('./package.json')

module.exports = (app) => {
  const logger = app.getLogger(pkg.name)
  const config = app.config.schema || {}

  app.schema = {
    SchemaModel,
    T,
    types: {},
    models: {}
  }

  app.$load_dir(config.types || 'types', (mod, name) => {
    try {
      const types = mod(app)
      Object.assign(app.schema.types, types)
    } catch(e) {
      logger.error(`load type "${name}" failed:`, e)
    }
  })

  app.$load_dir(config.models || 'models', (mod, name) => {
    try {
      const models = mod(app)
      Object.assign(app.schema.models, models)
    } catch(e) {
      logger.error(`load model "${name}" failed:`, e)
    }
  })

  app.interceptor.schema = (schema) => async (ctx, next) => {
    const data = ctx.method === 'POST' ? ctx.request.body : ctx.query
    const model = app.schema.models[schema]
    if (!model || typeof model.validate !== 'function') {
      logger.error(`"${schema}" is not valid schema model`)
    } else {
      const result = model.validate(data)
      if (result.hasError) return ctx.throw(400, result.errorMessage || '请求参数非法')
    }
    await next()
  }
}