const mysql = require('mysql')

function createMySqlDb(config, logger) {
  const pool = mysql.createPool(config)
  logger.debug('pool created')

  function query(sql, params) {
    return new Promise((resolve, reject) => {
      pool.query(sql, params, (error, results, fields) => {
        if (error) {
          logger.error(error, 'sql:', sql, 'params:', params || '')
          reject(error)
          return
        }
        resolve({ results, fields })
      })
    })
  }

  function queryHelper(callback) {
    return async (sql, params) => {
      const { results } = await query(sql, params)
      return callback(results)
    }
  }

  return {
    escape: (val) => mysql.escape(val),
    query,
    // 简化查询后数据处理的辅助方法
    select:       queryHelper(results => results),
    select_one:   queryHelper(results => results && results[0]),
    insert:       queryHelper(results => results.affectedRows),
    insert_one:   queryHelper(results => results.affectedRows === 1),
    insert_id:    queryHelper(results => results.insertId),
    update:       queryHelper(results => results.changedRows),
    update_one:   queryHelper(results => results.changedRows === 1),
    delete:       queryHelper(results => results.affectedRows),
    delete_one:   queryHelper(results => results.affectedRows === 1)
  }
}

const plugin = (app) => {
  app.db = app.context.db = createMySqlDb(
    app.config.mysql,
    app.getLogger('@luobotang/koa-mysql')
  )
}

plugin.createMySqlDb = createMySqlDb // 方便手动创建

module.exports = plugin // 自动安装插件