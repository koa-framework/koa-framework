module.exports = ({ defineValidation, defineObjectValidation }) => ({
  user_id: defineValidation('user_id', ['id', 3, 6]),
  user_name: defineValidation('user_name', 'notempty', 'string', ['length', 2, 20]),
  default: defineObjectValidation('用户', 'user_id', 'user_name')
})