const mysql = require('mysql')

module.exports = (app) => {
  const logger = app.getLogger('"@luobotang/koa-mysql')
  const pool = mysql.createPool(app.config.mysql)

  logger.info('pool created')

  app.db = app.context.db = {
    escape: (val) => mysql.escape(val),
    query(sql, params) {
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
    },
    // 简化查询后数据处理的辅助方法
    async select(sql, params) {
      const { results } = await app.db.query(sql, params)
      return results
    },
    async select_one(sql, params) {
      const { results } = await app.db.query(sql, params)
      return results && results[0]
    },
    async insert(sql, params) {
      const { results } = await app.db.query(sql, params)
      return results.affectedRows
    },
    async insert_one(sql, params) {
      const { results } = await app.db.query(sql, params)
      return results.affectedRows === 1
    },
    async insert_id(sql, params) {
      const { results } = await app.db.query(sql, params)
      return results.insertId
    },
    async update(sql, params) {
      const { results } = await app.db.query(sql, params)
      return results.changedRows
    },
    async update_one(sql, params) {
      const { results } = await app.db.query(sql, params)
      return results.changedRows === 1
    },
    async delete(sql, params) {
      const { results } = await app.db.query(sql, params)
      return results.affectedRows
    },
    async delete_one(sql, params) {
      const { results } = await app.db.query(sql, params)
      return results.affectedRows === 1
    }
  }
}
