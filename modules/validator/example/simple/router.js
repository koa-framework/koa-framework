module.exports = ({ router, middlewares, interceptor, controller }) => {
  const { validate } = interceptor
  router.use(middlewares.access)
  router.get('/user/byId', validate(['user_id']), controller.user.byId)
  router.get('/user/create', validate('user'), controller.user.create) // 简化环境配置需要，使用 GET 而非 POST
}
