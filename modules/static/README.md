# static

## 安装

```
npm i @luobotang/koa-static
```

## 配置

```js
module.exports = {
  static: {
    root: '/static/root/path',
    // other options to '[koa-static](https://www.npmjs.com/package/koa-static)'
  }
}
```

## 使用

```js
router.use(middlewares.static)
```
