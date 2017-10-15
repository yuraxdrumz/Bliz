import http from 'http'

const res = Object.create(http.ServerResponse.prototype)

res.json = function(data){
  this.setHeader('Content-Type','application/json')
  this.end(JSON.stringify(data))
}

export default res
