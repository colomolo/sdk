const express = require('express')
const app = express()

const authenticate = require('./utils/authenticate')
const authorizeMiddleware = require('./authorizeMiddleware')
const throwErrorWithCode = require('./utils/throwErrorWithCode')
const validateFields = require('./utils/validateFields')

const payments = require('./dbStubs').payments

app.use(express.json())

app.post('/v1/authenticate', (req, res) => {
  try {
    const credentials = { username: req.body.username, password: req.body.password }
    const token = authenticate(credentials)

    res.status(200).json(token)
  } catch (e) {
    res.status(400).json(e.json)
  }
})

app.use(authorizeMiddleware)

app.get('/v1/payments', (req, res) => {
  res.status(200).json(payments)
})

app.post('/v1/payments', (req, res) => {
  try {
    validateFields(req.body)
    
    res.status(200).json(payments[0])
  } catch (e) {
    res.status(400).json(e.json)
  }
})

app.get('/v1/payments/:id', (req, res) => {
  const payment = payments.find(payment => payment.id === req.params.id)

  res.status(200).json(payment)
})

app.put('/v1/payments/:id/approve', (req, res) => {
  const payment = payments.find(payment => payment.id === req.params.id)

  try {
    if (payment.status === 'cancelled')
      throwErrorWithCode('Cannot approve a payment that has already been cancelled', 'ERR_CANNOT_APPROVE')
  } catch (e) {
    res.status(400).json(e.json)
  }

  res.sendStatus(200)
})

app.put('/v1/payments/:id/cancel', (req, res) => {
  const payment = payments.find(payment => payment.id === req.params.id)

  try {
    if (payment.status === 'approved')
      throwErrorWithCode('"Cannot cancel a payment that has already been approved', 'ERR_CANNOT_CANCEL')
  } catch (e) {
    res.status(400).json(e.json)
  }

  res.sendStatus(200)
})

module.exports = app
