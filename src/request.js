import http from 'http'

const Request = Object.assign({}, http.IncomingMessage.prototype)

export default Request