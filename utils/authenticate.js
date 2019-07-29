const throwErrorWithCode = require('./throwErrorWithCode')
const { isUserValid, generateToken, setExpires } = require('./authUtils')

const checkCredentials = (credentials) => {
  if (!credentials.username || !credentials.username.length)
    throwErrorWithCode('No username provided', 'ERR_NO_USERNAME')

  if (!credentials.password || !credentials.password.length)
    throwErrorWithCode('No password provided', 'ERR_NO_PASSWORD')

  if (!isUserValid(credentials))
    throwErrorWithCode('Invalid user', 'ERR_INVALID_USER')

  return
}

module.exports = (credentials) => {
  checkCredentials(credentials)

  return {
    authToken: generateToken(credentials.username),
    expiresIn: new Date(setExpires() * 1000),
  }
}
