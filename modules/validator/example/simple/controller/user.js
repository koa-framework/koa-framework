const users = [
  {user_id: '001', user_name: 'A'},
  {user_id: '002', user_name: 'B'},
  {user_id: '003', user_name: 'C'},
]

exports.byId = async (ctx) => {
  const { user_id } = ctx.query
  ctx.body = users.find(i => i.user_id === user_id)
}

exports.create = async (ctx) => {
  const { user_id, user_name } = ctx.query
  if (users.findIndex(i => i.user_id === user_id) > -1) {
    return ctx.throw(401, '已有同名用户')
  }
  users.push({ user_id, user_name })
  ctx.body = { user_id, user_name }
}
