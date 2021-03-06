/**
 * 有关基于 mysql 库的数据编码（excape），参考：
 * https://github.com/mysqljs/mysql#escaping-query-values
 */
class SqlBuilder {
  constructor(mysql_db) {
    this._mode = 'select' // select | insert | update | delete
    this._table = ''
    this._fields = []
    this._conditions = []
    this._orderBy = null
    this._values = []
    this._set = {}

    // 关联数据库对象，用于直接执行 SQL 时使用
    this._db = mysql_db
  }

  /**
   * 查询模式
   * sql()
   *   .select('name', 'id')
   *   .from('TB_USER')
   *   .where('create_time > "2019-12-31"')
   *   .orderBy('create_time DESC')
   */

  select(...fields) {
    this._fields = fields
    return this.mode('select')
  }
  from(table) {
    return this.table(table)
  }
  where(...conditions) {
    this._conditions = conditions
    return this
  }
  orderBy(orderBy) {
    this._orderBy = orderBy
    return this
  }

  /**
   * 插入数据模式
   * sql()
   *   .insert('name', 'id')
   *   .into('TB_USER')
   *   .value('张三', 123)
   *   .value('李四', 456)
   */

  insert(...fields) {
    this._fields = fields
    return this.mode('insert')
  }
  into(table) {
    return this.table(table)
  }
  value(...data) {
    this._values.push(data)
    return this
  }

  /**
   * 更新数据模式
   * sql()
   *   .update('TB_USER')
   *   .set({name: '张三'})
   *   .where('id = 123')
   */

  update(table) {
    return this.table(table).mode('update')
  }
  set(_set) {
    if (typeof _set !== 'string') _set = this.escape(_set)
    this._set = _set
    return this
  }

  /**
   * 删除模式
   * sql()
   *  .delete()
   *  .from('TB_USER')
   *  .where('id = 1')
   */

  delete() {
    return this.mode('delete')
  }

  // util

  table(table) {
    this._table = table
    return this
  }

  mode(mode) {
    this._mode = mode
    return this
  }

  escape(val) {
    return this._db.escape(val)
  }
  
  sql() {
    if (this._mode === 'select') {
      let sql = `SELECT ${this._fields.join(', ')} FROM ${this._table}`
      if (this._conditions.length) {
        sql += ` WHERE ${this._conditions.join(' AND ')}`
      }
      if (this._orderBy) {
        sql += ` ORDER BY ${this._orderBy}`
      }
      return sql
    }
    if (this._mode === 'insert') {
      return `INSERT INTO ${this._table} (${this._fields.join(',')}) VALUES ${this.escape(this._values)}`
    }
    if (this._mode === 'update') {
      let sql = `UPDATE ${this._table} SET ${this._set}`
      if (this._conditions.length) {
        sql += ` WHERE ${this._conditions.join(' AND ')}`
      }
      return sql
    }
    if (this._mode === 'delete') {
      return `DELETE FROM ${this._table} WHERE ${this._conditions.join(' AND ')}`
    }
    throw new Error('不支持的模式')
  }

  // 执行

  query(...replaceValues) {
    return this._db.query(this.sql(), replaceValues)
  }
  exec(...replaceValues) {
    if (this._mode === 'select') {
      return this._db.select(this.sql(), replaceValues)
    }
    if (this._mode === 'insert') {
      return this._db.insert(this.sql(), replaceValues)
    }
    if (this._mode === 'update') {
      return this._db.update(this.sql(), replaceValues)
    }
    if (this._mode === 'delete') {
      return this._db.delete(this.sql(), replaceValues)
    }
    throw new Error('不支持的模式')
  }
  execOne(...replaceValues) {
    if (this._mode === 'select') {
      return this._db.select_one(this.sql(), replaceValues)
    }
    if (this._mode === 'insert') {
      return this._db.insert_one(this.sql(), replaceValues)
    }
    if (this._mode === 'update') {
      return this._db.update_one(this.sql(), replaceValues)
    }
    if (this._mode === 'delete') {
      return this._db.delete_one(this.sql(), replaceValues)
    }
    throw new Error('不支持的模式')
  }
}

function createSql(db) {
  return new SqlBuilder(db)
}

const plugin = app => {
  app.SqlBuilder = SqlBuilder
  app.sql = () => createSql(app.db)
}

plugin.SqlBuilder = SqlBuilder
plugin.createSql = createSql

module.exports = plugin