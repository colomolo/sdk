const request = require('request-promise-native')

const server = require('../server')
const payments = require('../dbStubs').payments

let app
const PORT = 3000

process.env.SECRET = 'test'

const paymentMock = {
  "payeeId": "a5b500e1-2ba7-4623-baa2-e09b6a721b5e",
  "payerId": "d8f090ae-a4ed-42dc-9181-f51564d0e304",
  "paymentSystem": "yandexMoney",
  "paymentMethod": "PMB",
  "amount": 4337.01,
  "currency": "RUB",
  "status": "created",
  "comment": null,
}

let token = ''

const url = (path) => `http://localhost:${PORT}${path}`

const authenticate = () => {
  return request({
    method: 'POST',
    uri: url('/v1/authenticate/'),
    body: {
      username: 'test',
      password: 'test',
    },
    json: true,
  })
}

const PUTRequest = (uri, token) => {
  return request({
    method: 'PUT',
    uri: uri,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    json: true,
  })
}

beforeAll((done) => {
  app = server.listen(PORT)

  return authenticate().then((json) => {
    token = json.authToken
    done()
  })
})
afterAll(done => app.close(done))

test('POST /v1/authenticate returns auth token', () => {
  return authenticate()
    .then(json => expect(json.authToken).toBeTruthy())
})

test('GET /v1/payments without access token returns error', () => {
  return request(`${url('/v1/payments')}`)
    .catch(e => expect(e.statusCode).toEqual(401))
})

test('GET /v1/payments with access token returns payments list', () => {
  return request({
    uri: url('/v1/payments'),
    qs: { access_token: token },
    json: true,
  })
    .then(json => expect(json).toMatchObject(payments))
})

test('GET /v1/payments/1 with access token returns payment with id=1', () => {
  return request({
    uri: url('/v1/payments/1'),
    qs: { access_token: token },
    json: true,
  })
    .then(json => expect(json).toMatchObject(payments.find(payment => payment.id === '1')))
})

test('POST /v1/payments with access token returns payments list', () => {
  return request({
    method: 'POST',
    uri: url('/v1/payments'),
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: paymentMock,
    json: true,
  })
    .then(json => expect(json).toMatchObject(payments[0]))
})

test('PUT /v1/payments/1/approve approves payment with id=1', () => {
  return PUTRequest(url('/v1/payments/1/approve'), token)
    .then(res => expect(res).toEqual('OK'))
})

test('PUT /v1/payments/2/approve cannot approve payment with id=2', () => {
  return PUTRequest(url('/v1/payments/2/approve'), token)
    .catch(e => expect(e.statusCode).toEqual(400))
})

test('PUT /v1/payments/1/cancel cancels payment with id=1', () => {
  return PUTRequest(url('/v1/payments/1/cancel'), token)
    .then(res => expect(res).toEqual('OK'))
})

test('PUT /v1/payments/3/cancel cannot cancel payment with id=3', () => {
  return PUTRequest(url('/v1/payments/3/cancel'), token)
    .catch(e => expect(e.statusCode).toEqual(400))
})
