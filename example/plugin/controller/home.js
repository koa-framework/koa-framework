exports.index = async (ctx) => {
  ctx.type = 'html'
  ctx.body = ctx.render('index.html', {title: 'Hello, world!'})
}
