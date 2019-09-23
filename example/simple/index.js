const createApp = require('../../koa-framework')

const appRoot = __dirname
const appConfig = {
  log4js: {
    appenders: { out: { type: 'console' } },
    categories: {
      default: { appenders: ['out'], level: 'info' },
    }
  }
}

createApp(appRoot, appConfig).listen(8080, () => console.log('on 8080...'))
