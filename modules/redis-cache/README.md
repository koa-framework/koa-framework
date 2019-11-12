# redis-cache

借助 redis 缓存数据

## 使用

### 配置

示例：

```js
module.exports = {
  cache: {
    prefix: 'my-app'
  }
}
```

配置项说明：

- ```prefix```: 在 redis 中统一添加该前缀添加到传入 key，例如 ```app.cache.set('foo', {name: 'luobotang'})```` 实际 redis 的 key 为 ``my-app__foo```

### 插件

在 controller 使用：

```js
exports.foo = async (ctx) => {
  const data = await ctx.cache.get('bar')
  if (data) {
    ctx.body = data
    return
  }
  const new_data = await ctx.service.xxx.getData()
  await ctx.cache.set('bar', new_data)
  ctx.body = new_data
}
```

上面例子也可以简化为：

```js
exports.foo = async (ctx) => {
  ctx.body = await ctx.cache.getOrSet('bar', async () => await ctx.service.xxx.getData())
}
```

### 拦截器

在 router 中使用：

```js
router.get('/user', interceptor.cache.get('user', 'user_id'), controller.user.get)
router.post('/user', interceptor.cache.del('user', 'user_id'), controller.user.post)
router.delete('/user', interceptor.cache.del('user', 'user_id'), controller.user.delete)
```
