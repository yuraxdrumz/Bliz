import http from 'http'
import etag from 'etag'

const res = Object.create(http.ServerResponse.prototype)

res.status = function(status){
  this.statusCode = status
  return this
}

res.addHeader = function(header, value){
  this.setHeader(header, value)
  return this
}


res.json = function(data){
  this.addHeader('Content-Type','application/json')
  this.addHeader('X-Powered-By', 'Bliz')
  const stringified = JSON.stringify(data, null, 3)
  this.addHeader('ETag', etag(stringified))
  this.end(stringified)
}

// res.vjson = function(data){
//   console.log(this, data, this.statusCode)
//   if(this.schema[this.statusCode]){
//     this.schema[this.statusCode](data)
//   }else {
//     console.warn('no matching schema for status ' + this.statusCode)
//     this.json(data)
//   }
// }

export default res
