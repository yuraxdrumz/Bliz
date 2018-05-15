import http from 'http'
import etag from 'etag'

const res = Object.create(http.ServerResponse.prototype)

res.json = function(data){
  this.setHeader('Content-Type','application/json')
  const stringified = JSON.stringify(data, null, 3)
  this.setHeader('ETag', etag(stringified))
  this.end(stringified)
}

export default res
