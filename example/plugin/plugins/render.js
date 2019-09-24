const fs = require('fs')
const path = require('path')

module.exports = (app) => {
  const { template_root } = app.config.render
  app.render = app.context.render = (template, data) => {
    return fs.readFileSync(path.join(template_root, template), {encoding: 'utf8'})
      .replace(/\{\{\s*([^{}\s]+)\s*\}\}/g, (_, key) => data[key])
  }
}
