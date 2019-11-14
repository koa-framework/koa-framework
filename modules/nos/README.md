# nos

## 安装

```
npm i @luobotang/koa-nos
```

## 配置

```js
module.exports = {
  nos: {
    accessKey: 'your-access-key',
    accessSecret: 'your-access-secret',
    endpoint: 'http://nos.netease.com',
    defaultBucket: 'nos-test'
  }
}
```

## 使用

```js
exports.download = async (ctx) => {
  const { filename } = ctx.query
  ctx.response.attachment(filename)
  ctx.body = await ctx.nos.get(filename)
}

exports.upload = async (ctx) => {
  const { originalname, buffer } = ctx.file // @koa/multer
  await ctx.nos.put(originalname, require('streamifier').createReadStream(buffer))
  ctx.body = 'OK'
}

exports.delete = async (ctx) => {
  const { filename } = ctx.query
  await ctx.nos.del(filename)
  ctx.body = 'OK'
}
```
