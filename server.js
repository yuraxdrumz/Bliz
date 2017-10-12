const http = require('http')

// receive an http and a handler and return a listen func
const Listen = (http, handler) => ({
  listen:(...args)=>{
    const server = http.createServer(handler)
    return server.listen.apply(server, args)
  }
})
// method creator for router, name, chainlink for chaining and mem to store it to
const Method = (name, chainLink, mem) => ({
  [name]:route=>{mem[route.path] = route;return chainLink}
})
// router error handler creator, chainlink is the router name to chin and mem is where to store it to
const RouterErrorHandler = (chainLink, mem) =>({
  routerErrorHandler:func=>{mem = func;return chainLink}
})
// router list routes creator
const ListRoutes = (get, post, put, deleted, routerErrorHandler, base) =>({
  listRoutes:()=>({get, post, put, deleted, routerErrorHandler, base})
})

// receive a basepath for the router and return router funcs like get post and list
const Router = base => {
  let get                = {}
  let post               = {}
  let put                = {}
  let deleted            = {}
  let routerErrorHandler = null
  const RouterReturn     = {}

  return Object.assign(RouterReturn,
    Method('get', RouterReturn, get),
    Method('post', RouterReturn, post),
    Method('put', RouterReturn, put),
    Method('delete', RouterReturn, deleted),
    RouterErrorHandler(RouterReturn, routerErrorHandler),
    ListRoutes(get, post, put, deleted, routerErrorHandler, base)
  )
}

// when called, receives a router type
// returns a Router func which allows to create routers with Router and basepath provided
const CreateRouter = Router => ({
  createRouter: basePath =>{
    return Object.assign(
      {},
      Router(basePath)
    )
  }

})

const defaultHandler = function(req ,res){
  res.writeHead(404)
  res.write('Default Error handler, route not found')
  res.end()
}

const urlUtil = (req) => {
  const dividedUrl = req.url.split('/');
  const baseOfRequest = `/${dividedUrl[1]}`
  let method = req.method.toLowerCase()
  if(method === 'delete') method = 'deleted'
  let rest = `/${dividedUrl.slice(2).join('/')}`
  if(rest[rest.length - 1] === '/') rest = rest.slice(0,rest.length -1)
  return {
    baseOfRequest,
    method,
    rest
  }
}

const RegisterRouters = (http, Listen, urlUtil, defaultHandler) => ({
  registerRouters:(...routers)=>{
    const routes = {}
    routers.forEach(router=>{let list = router.listRoutes();routes[list.base] = list})
    console.log(routes)
    const handler = function(req,res){
      const { baseOfRequest, method, rest } = urlUtil(req)
      if(!routes[baseOfRequest]) return defaultHandler(req ,res)
      else if(!routes[baseOfRequest])return defaultHandler(req ,res)
      else if(!routes[baseOfRequest][method])return defaultHandler(req ,res)
      else if(!routes[baseOfRequest][method][rest]) return defaultHandler(req ,res)
      try{
        routes[baseOfRequest][method][rest].handler(req,res)
      }catch(errorFromHandler){
        try{
          routes[baseOfRequest][method][rest].errHandler(req,res,errorFromHandler)
        }catch(errorFromErrHandler){
          try{
            routes[baseOfRequest].routerErrorHandler(req,res,errorFromHandler, errorFromErrHandler)
          }catch(e){
            defaultHandler(req,res)
          }
        }
      }
    }
    return Listen(http, handler)
  }
})
// main instance creator, returns a func which expects an http object and creates an instance
const ExpAppCreator = (Router, Listen, urlUtil, defaultHandler) => {
  return createInstanceFactory = (http) => {
    return Object.assign(
      {},
      CreateRouter(Router),
      RegisterRouters(http, Listen,urlUtil, defaultHandler)
    )
  }
}


let exp = ExpAppCreator(Router, Listen, urlUtil, defaultHandler)(http)

const apiRouter = exp.createRouter('/api')
const authRouter = exp.createRouter('/auth')
const apiMainRoute = {
  path: '/getData',
  handler: (req, res) => {
    res.write('this is api main route')
    res.end()
  }
}

const apiGetAA = {
  path:'/getAA',
  handler:(req,res)=>{
    res.write('this is AA')
    res.end()
  }
}
const authMainRoute = {
  path:'/login',
  handler:(req,res)=>{
    res.write('this is auth main route')
    res.end()
  },
  errHandler:function(req,res,e1){res.writeHead(500);res.write(e1.toString());res.end()}
}
const errHandlerForAPi = function(req,res,e1,e2){
  res.writeHead(404)
  res.write(e1.toString())
  res.write(e2.toString())
  res.end()
}

apiRouter
  .get(apiMainRoute)
  .delete(apiGetAA)
  .routerErrorHandler(errHandlerForAPi)

authRouter.post(authMainRoute).routerErrorHandler(errHandlerForAPi)

exp
  .registerRouters(apiRouter, authRouter)
  .listen(3000, ()=>console.log(`listening on port 3000`))



