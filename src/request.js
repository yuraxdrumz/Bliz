import http from 'http'

const req = Object.create(http.IncomingMessage.prototype)

export default req
