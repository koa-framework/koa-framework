# @luobotang/koa-multer

## 安装

```
npm i @luobotang/koa-multer
```

## 配置

```js
module.exports = {
  multer: {
    // options pass to 'multer'
  }
}
```

## 使用

路由：

```js
router.post('/form', interceptor.multer.single('file'), controller.foo.form)
```

Controller：

```js
exports.form = async (ctx) => {
  const { originalname, size, mimetype } = ctx.file
  ctx.body = `${originalname} ${size} ${mimetype}`
}
```
