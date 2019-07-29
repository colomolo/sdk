module.exports = (message, code, json = {}) => {
  const error = new Error(message)

  error.json = {
    ...{
      code,
      message,
    },
    ...json,
  }

  throw error
}
