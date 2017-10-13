import http from 'http'

const Response = Object.assign({}, http.OutgoingMessage.prototype)

export default Response