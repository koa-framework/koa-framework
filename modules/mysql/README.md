# @luobotang/koa-mysql

## 配置

```app.config.mysql```

参考：[mysqljs/mysql](https://github.com/mysqljs/mysql#connection-options)

## API

`MySqlDb`:

- ```db.escape(val)```: 内部调用 ```mysql.escape(val)```
- ```db.query(sql, params)```: 基础查询方法，返回 Promise，成功数据为 { results, fields }，失败数据为错误信息。
- ```async db.select(sql, params)```: 返回 results
- ```async db.select_one(sql, params)```: 返回 results[0]
- ```async db.insert(sql, params)```: 返回 results.affectedRows
- ```async db.insert_one(sql, params)```: 返回 results.affectedRows[0]
- ```async db.insert_id(sql, params)```: 返回 results.insertId
- ```async db.update(sql, params)```: 返回 results.changedRows
- ```async db.update_one(sql, params)```: 返回 results.changedRows[0]
- ```async db.delete(sql, params)```: 返回 results.affectedRows
- ```async db.delete_one(sql, params)```: 返回 results.affectedRows[0]

作为插件自动安装后，即添加 `app.db` 和 `app.context.db`，值为 `MySqlDb` 类型。

也可以手动创建：

```js
const { createMySqlDb } = require('@luobotang/koa-mysql')

const db = createMySqlDb(
  { /* mysql config */ },
  logger /* log4js logger */
)
```
