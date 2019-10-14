const { URL, URLSearchParams } = require('url')
const fetch = require('node-fetch')

module.exports = (app) => {
  app.fetch = app.context.fetch = fetch
  app.fetch_get = app.context.fetch_get = (url, params) => {
    url = new URL(url)
    if (params) {
      params = new URLSearchParams(params)
      url.search += (url.search ? '&' : '?') + params.toString()
    }
    return fetch(url.toString())
  }
  app.fetch_post = app.context.fetch_post = (url, data) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : ''
    })
  }
}
