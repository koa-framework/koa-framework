const base_validators = {
  notempty(value, key = '') {
    if (value === undefined || value === null) return key + ' 值不能为空'
  },
  string(value, key = '') {
    if (typeof value !== 'string') return key + ' 类型应为 string'
  },
  length(value, key = '', min = 0, max = 100) {
    const len = value && value.length || 0
    if (len < min) return key + ' 长度不应小于 ' + min
    if (len > max) return key + ' 长度不应大于 ' + max
  },
  number(value, key = '') {
    if (typeof value !== 'number') return key + ' 类型应为 number'
    if (isNaN(value)) return key + ' 不能为 NaN'
  },
  array(value, key = '') {
    if (!Array.isArray(value)) return key + ' 应为数组'
  },
  size(value, key, min = 0, max = 100) {
    if (value < min) return key + ' 不应小于 ' + min
    if (value > max) return key + ' 不应大于 ' + max
  },
  id(value, key = '', min = 1, max = 100) {
    return (
      base_validators.notempty(value, key) ||
      base_validators.string(value, key) ||
      base_validators.length(value, key, min, max)
    )
  }
}

module.exports = (app) => {
  const logger = app.getLogger('@luobotang/koa-validator')

  app.base_validators = base_validators
  const validators = app.validators = {}

  /**
   * defineValidation('foo', 'notempty', 'string', ['length', 8, 36])
   */
  app.defineValidation = (key, ...rules) => {
    if (rules.length === 0) {
      logger.error('未定义校验规则', key)
      return
    }
    rules = rules.map(item => {
      if (typeof item === 'string') return {name: item, args: []}
      if (Array.isArray(item)) return {name: item[0], args: item.slice(1)}
      if (typeof item === 'function') return {fn: item, args: []}
      logger.error('不支持的校验规则', item, key)
    })
    return (value) => {
      for (let rule of rules) {
        try {
          let {name, args} = rule
          let fn = rule.fn || base_validators[name] || validators[name]
          if (typeof fn !== 'function') {
            logger.error('校验函数不存在:', name, key)
            return '校验失败'
          }
          let msg = fn(value, key, ...args)
          if (msg) return msg
        } catch(e) {
          logger.error('校验异常', rule, key, e)
          return e.message
        }
      }
    }
  }

  /**
   * defineObjectValidation('obj_id', 'obj_name', ['note', 'obj_note'])
   */
  app.defineObjectValidation = (name, ...validations) => {
    validations = validations.map(item => {
      if (typeof item === 'string') return {key: item, name: item}
      else return {key: item[0], name: item[1]}
    })
    return (data) => {
      if (!data) return name + '数据不能为空'
  
      for (let item of validations) {
        let fn = validators[item.name]
        try {
          let msg = fn(data[item.key])
          if (msg) return msg
        } catch(e) {
          logger.error('校验异常', item, name,  e)
          return item.name + ' 校验失败'
        }
      }
    }
  }

  logger.debug('加载校验目录...')
  app.$load_dir('validator', (mod, name) => {
    logger.debug('加载校验模块', name)
    const obj = mod(app)
    if (typeof obj === 'function') {
      logger.debug('加载校验项', name)
      validators[name] = obj
      return
    }
    for (let key of Object.keys(obj)) {
      if (key === 'default') {
        logger.debug('加载校验项', name)
        validators[name] = obj[key]
      } else {
        logger.debug('加载校验项', key)
        validators[key] = obj[key]
      }
    }
  })
  logger.debug('加载校验目录完成')

  app.interceptor.validate = require('./interceptor')(app)
}
