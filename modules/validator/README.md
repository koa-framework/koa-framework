# validator

数据校验插件

## 使用

应用配置：

```js
module.exports = {
  plugins: [
    '@luobotang/koa-validator'
  ]
}
```

校验配置，放在应用根目录下的 validator 中，以文件名加载到 app.validator 上。

示例，```validator/user.js```：

```js
module.exports = ({ defineValidation, defineObjectValidation }) => ({
  user_id: defineValidation('user_id', ['id', 4, 20]),
  user_name: defineValidation('user_name', 'notempty', 'string', ['length', 2, 20]),
  default: defineObjectValidation('用户', 'user_id', 'user_name')
})
```

在 router.js 中使用，示例：

```js
module.exports = ({ router, interceptor, controller }) => {
  const { validate } = interceptor
  router.get('/user/byId', validate(['user_id']), controller.user.byId)
  router.post('/user/create', validate('user'), controller.user.create)
}
```

## API

- ```app.base_validators```
- ```app.validators```
- ```app.defineValidation(key, ...rules)```
- ```app.defineObjectValidation(name, ...validations)```
- ```app.interceptor.validate()```
