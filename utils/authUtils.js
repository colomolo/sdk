const jwt = require('jsonwebtoken')

const users = require('../dbStubs').users

const DAY_IN_SECONDS = 24 * 60 * 60
const EXPIRE_IN_DAYS = 7

const isUserValid = (credentials) => {
  const user = users
    .find(record => record.username === credentials.username && record.password === credentials.password)

  return !!user
}

const setExpires = () => Math.floor(Date.now() / 1000) + EXPIRE_IN_DAYS * DAY_IN_SECONDS

const generateToken = (username) => {
  const payload = { username: username, exp: setExpires() }

  return jwt.sign(payload, process.env.SECRET)
}

const verifyToken = token => jwt.verify(token, process.env.SECRET)

module.exports = {
  isUserValid,
  setExpires,
  generateToken,
  verifyToken,
}
