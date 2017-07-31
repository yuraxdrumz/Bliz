const http = require('http')

// TODO figure out how to pass req and res and attach methods to them
// TODO figure out how to add next for middlewares
// TODO maybe make middlewares with async await and add compatability for express middlewares?
// TODO add func for list all routes
// TODO add func for list all middlewares

class App{
  constructor(){
    this.routes = {}
    this.middlewares = []
  }
  // middlewares handler, recursively execute each middleware until complete, then return with req and res
  middleWaresHandler(middleWares, req, res, currentMiddleWare = 0){
    try{
      if(currentMiddleWare === middleWares.length) return {req, res}
      let currMid = middleWares[currentMiddleWare]
      currMid(req, res)
      return this.middleWaresHandler(middleWares, req, res, currentMiddleWare+=1)

    }catch(error){
      console.error(error)
    }
  }
  // handler for http server
  handler(req, res){
    try{
      let completeMds = this.middleWaresHandler(this.middlewares, req, res)
      req = completeMds.req
      res = completeMds.res
      if(this.routes[req.url] && this.routes[req.url].method === req.method){
        return this.routes[req.url].fn(req,res)
      }
      return this.routeNotFound(req, res)
    }catch(error){
      console.error(error)
      // next(error)
    }
  }
  // final handler
  routeNotFound(req, res, next){
    try{
      res.writeHead(404)
      res.write('Route Not Found')
      res.end()
    }catch (error){
      console.error(error)
    }
  }
  get(route,fn){
    try{
      this.routes[route] = {
        fn,
        method:'GET'
      }
    }catch(error){
      throw error
    }
  }
  // write middleware func
  use(fn){
    this.middlewares.push(fn)
  }
  post(route,fn){
    try{
      this.routes[route] = {
        fn,
        method:'POST'
      }
    }catch(error){
      throw error
    }
  }

  listen(){
    const server = http.createServer(this.handler.bind(this))
    return server.listen.apply(server, arguments)
  }
}

let app = new App()

app.use((req,res)=>{
  console.log(`${Date.now()}, ${req.headers.host}, ${req.url}`)
})

app.use((req, res)=>{
  res.json = function(data){
    this.writeHead(200, {'Content-Type': 'application/json'})
    this.write(JSON.stringify(data))
    this.end()
  }
})

app.get('/',(req, res, next)=>{
  console.log(res.json)
  res.json({
    bla: 'blabla',
    int:1
  })
})
app.post('/post',(req, res, next)=>{
  res.json('yeahh boi')
})

app.listen(3000,()=>{
  console.log('listening on port 3000')
})


