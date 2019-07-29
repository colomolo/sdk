const server = require('./server')

const PORT = 3000

server.listen(PORT, () => {
  console.log(`Listening on 127.0.0.1:${PORT}`)
})
