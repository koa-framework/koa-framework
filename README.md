# koa-framework

基于 Koa.js 的简单应用框架。

## 使用

```js
const createApp = require('@luobotang/koa-framework')
const appRoot = __dirname
const appConfig = { /* log4js: { ... }, ... */ }

createApp(appRoot, appConfig).listen(8080, () => console.log('on 8080..'))
```

## 约定

创建应用时，koa-framework 在应用根目录下依次查找一下目录或文件并同步加载其中的模块：

- extend 目录：扩展 app 对象，业务无关
- service 目录：全局服务，业务相关；按模块名称添加到 ```app.service``` 和 ```ctx.service```
- middleware 目录：全局中间件；按模块名称添加到 ```app.middlewares```
- interceptor 目录：特定路由拦截器；按模块名称添加到 ```app.interceptor```
- controller 目录：路由处理；按模块名称添加到 ```app.controller```
- router.js 文件：初始化应用路由

## extend 目录

示例（```extend/db.js```）：

```js
const mysql = require('mysql')

module.exports = (app) => {
  const pool = mysql.createPool(app.config.mysql)
  app.db = app.context.db = {
    async query(sql, params) {
      return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, result) => {
          if (error) return reject(error)
          resolve(result)
        })
      })
    }
  }
}
```

## service 目录

示例（```service/user.js```）：

```js
module.exports = (app) => {
  return {
    async selectUserById(user_id) {
      return await app.db.query(`
        SELECT user_id, user_name, user_status FROM TB_USER WHERE user_id = ?
      `, [user_id])[0]
    }
  }
}
```

## middleware 目录

示例（```middleware/access.js```）：

```js
module.exports = (app) => {
  const logger = app.getFileLogger(__filename)
  return async (ctx, next) => {
    logger.info(ctx.method, ctx.path, ctx.ip)
    await next()
  }
}
```

## interceptor 目录

示例（```interceptor/log.js```）：

```js
modile.exports = (app) => {
  const logger = app.getFileLogger(__filename)
  return (action) => async (ctx, next) => {
    logger.info(action, ctx.query)
    await next()
  }
}
```

## controller 目录

示例（```controller/user.js```）：

```js
exports.byId = async (ctx) => {
  const { user_id } = ctx.query
  ctx.body = await ctx.service.user.selectUserById(user_id)
}
```

## router.js 文件

示例 ：

```js
module.exports = ({ router, middlewares, interceptor, controller }) => {
  router.use(middlewares.access)

  router.get('/user', interceptor.log('query-user'), controller.user.byId)
}
```
