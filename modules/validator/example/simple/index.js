const path = require('path')
const createApp = require('../../../../koa-framework')

createApp(__dirname, {
  log4js: {
    appenders: { out: { type: 'console' } },
    categories: {
      default: { appenders: ['out'], level: 'info' },
    }
  },
  plugins: [
    path.resolve(__dirname, '../../index.js')
  ]
}).listen(8888, () => console.log('on 8888..'))
