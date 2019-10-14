# @luobotang/koa-mysql

## 配置

```app.config.mysql```

参考：[mysqljs/mysql](https://github.com/mysqljs/mysql#connection-options)

## API

- ```app.db.escape(val)```: 内部调用 ```mysql.escape(val)```
- ```app.db.query(sql, params)```: 基础查询方法，返回 Promise，成功数据为 { results, fields }，失败数据为错误信息。
- ```async app.db.select(sql, params)```: 返回 results
- ```async app.db.select_one(sql, params)```: 返回 results[0]
- ```async app.db.insert(sql, params)```: 返回 results.affectedRows
- ```async app.db.insert_one(sql, params)```: 返回 results.affectedRows[0]
- ```async app.db.insert_id(sql, params)```: 返回 results.insertId
- ```async app.db.update(sql, params)```: 返回 results.changedRows
- ```async app.db.update_one(sql, params)```: 返回 results.changedRows[0]
- ```async app.db.delete(sql, params)```: 返回 results.affectedRows
- ```async app.db.delete_one(sql, params)```: 返回 results.affectedRows[0]
