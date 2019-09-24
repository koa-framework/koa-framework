const path = require('path')
const createApp = require('../../koa-framework')

const appRoot = __dirname
const appConfig = {
  plugins: [
    path.join(__dirname, 'plugins/render.js')
  ],
  render: {
    template_root: path.join(__dirname, 'templates')
  }
}

createApp(appRoot, appConfig).listen(8080, () => console.log('on 8080...'))
