const { NosClient } = require('@xgheaven/nos-node-sdk')

module.exports = (app) => {
  const logger = app.getLogger('@luobotang/koa-nos')
  const { nos } = app.config
  const client = new NosClient(nos)

  app.nos = app.context.nos = {
    put(objectKey, body) {
      logger.debug('put', objectKey)
      return client.putObject({ objectKey, body })
    },
    get(objectKey, encode = 'stream') {
      logger.debug('get', objectKey)
      return client.getObject({ objectKey, encode })
    },
    del(objectKey) {
      logger.debug('del', objectKey)
      return client.deleteObject({ objectKey })
    }
  }
}
