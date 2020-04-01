用于在 Service 中构建 SQL 并执行查询，例如：

```js
// service/user.js
module.exports = (app) => {
  return {
    queryById(user_id) {
      return app.sql()
        .select('user_id', 'user_name', 'create_time')
        .from('TB_USER')
        .where(`user_id = ${app.db.escape(user_id)}`)
        .execOne()
    }
  }
}
```

支持的 SQL 类型：
- select：
  ```js
  sql()
    .select('name', 'id')
    .from('TB_USER')
    .where('create_time > "2019-12-31"')
    .orderBy('create_time DESC')
  ```
- insert：
  ```js
  sql()
    .insert('name', 'id')
    .into('TB_USER')
    .value('张三', 123)
    .value('李四', 456)
  ```
- update：
  ```js
  sql()
    .update('TB_USER')
    .set({name: '张三'})
    .where('id = 123')
  ```
- delete：
  ```js
  sql()
    .delete()
    .from('TB_USER')
    .where('id = 1')
  ```

执行模式：
- 只生成 SQL：
  ```js
  sql.sql()
  ```
- 执行，返回结果数组：
  ```js
  sql.exec()
  ```
- 执行，只返回第一个返回结果：
  ```js
  sql.execOne()
  ```
