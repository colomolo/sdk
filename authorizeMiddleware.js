const throwErrorWithCode = require('./utils/throwErrorWithCode')
const { verifyToken } = require('./utils/authUtils')

const users = require('./dbStubs').users

module.exports = (req, res, next) => {
  let token = req.headers['authorization'] || req.query.access_token
  let tokenPayload = {}

  if (token && token.startsWith('Bearer ')) token = token.slice(7, token.length)

  try {
    if (!token) throwErrorWithCode('No auth token provided', 'ERR_UNATHORIZED')

    try {
      tokenPayload = verifyToken(token)
    } catch (jwtError) {
      throwErrorWithCode(jwtError.message, 'ERR_INVALID_TOKEN')
    }

    const user = users.find(record => record.username === tokenPayload.username)

    if (!user) throwErrorWithCode('Invalid token', 'ERR_UNATHORIZED')

    next()
  } catch (e) {
    try {
      if (e.message === 'jwt expired')
        throwErrorWithCode('Auth token expired', 'ERR_AUTH_TOKEN_EXPIRED')
    } catch (expiredError) {
      return res.status(401).json(expiredError.json)
    }

    return res.status(401).json(e.json)
  }
}
