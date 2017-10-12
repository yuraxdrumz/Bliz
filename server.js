const http = require('http')
const Promise = require('bluebird')

// receive an http and a handler and return a listen func
const Listen = (http, handler) => ({
  listen:(...args)=>{
    const server = http.createServer(handler)
    return server.listen.apply(server, args)
  }
})
// method creator for router, name, chainlink for chaining and mem to store it to
const Method = (name, mem,chainLink) => ({
  [name]:route=>{mem[route.path] = route;return chainLink}
})
// router error handler creator, chainlink is the router name to chin and mem is where to store it to
const CreateHandler = (name, mem, chainLink) =>({
  [name]:func=>{mem[name] = func;return chainLink}
})
// router list routes creator
const GetObjProps = obj =>({
  getObjProps:()=>(obj)
})

// receive a basepath for the router and return router funcs like get post and list
// const Router = base => {
//   let get                = {}
//   let post               = {}
//   let put                = {}
//   let deleted            = {}
//   let middleWareArr      = []
//   let routerErrorHandler = null
//   const RouterReturn     = {}
//
//   return Object.assign(RouterReturn,
//     Method('get', get, RouterReturn),
//     Method('post', post, RouterReturn),
//     Method('put', put, RouterReturn),
//     Method('delete', deleted, RouterReturn),
//     CreateMiddleWare(middleWareArr, RouterReturn),
//     CreateHandler(routerErrorHandler, RouterReturn),
//     ListRoutes(get, post, put, deleted, routerErrorHandler, base, middleWareArr)
//   )
// }
const Router = base => {
  const RouterReturn = {}
  const routerData = {
    get: {},
    post: {},
    put : {},
    deleted :{},
    middleWareArr :[],
    routerErrorHandler: null
  }
  return Object.assign(RouterReturn,
    CreateHandler('get', routerData, RouterReturn),
    CreateHandler('post', routerData, RouterReturn),
    CreateHandler('put', routerData, RouterReturn),
    CreateHandler('delete', routerData, RouterReturn),
    CreateHandler('routerErrorHandler',routerData, RouterReturn),
    CreateMiddleWare(routerData.middleWareArr, RouterReturn),
    GetObjProps(routerData)
  )
}
const CreatePath = () => {
  const PathReturn = {}
  const pathData = {
    middleWareArr:[],
    path:null,
    handler:null,
    errHandler:null
  }
  return {
    createPath:()=> Object.assign(
      PathReturn,
      CreateMiddleWare(pathData.middleWareArr, PathReturn),
      CreateHandler('handler', pathData, PathReturn),
      CreateHandler('path', pathData, PathReturn),
      CreateHandler('errHandler', pathData, PathReturn),
      GetObjProps(pathData)
    )
  }
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

const defaultHandler = function(req ,res, ...errs){
  res.writeHead(404)
  if(errs.length > 0){
    errs.map(err=>res.write(err.toString()))
  }else{
    res.write(`url:${req.url} not found...`)
  }

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

const RegisterRouters = (http, Listen, urlUtil, defaultHandler, middleWares,midHandler) => ({
  registerRouters:(...routers)=>{
    const routes = {}
    // routers.forEach(router=>{let list = router.getObjProps();routes[list.path] = list})
    routers.forEach(router=>console.log(router.getObjProps()))
    const handler = async function(req,res){
      const { baseOfRequest, method, rest } = urlUtil(req)
      try{
        if(middleWares) await midHandler(req,res,middleWares)
      }catch(middleWareError){
        return defaultHandler(req,res,middleWareError)
      }
      if(!routes[baseOfRequest]) return defaultHandler(req ,res)
      else if(!routes[baseOfRequest])return defaultHandler(req ,res)
      else if(!routes[baseOfRequest][method])return defaultHandler(req ,res)
      else if(!routes[baseOfRequest][method][rest]) return defaultHandler(req ,res)

      try{
        const routerMiddlewares = routes[baseOfRequest].middleWareArr
        if(routerMiddlewares) await midHandler(req,res, routerMiddlewares)
        const specificRouteMiddlewares = routes[baseOfRequest][method][rest].middlewares
        if(specificRouteMiddlewares) await midHandler(req,res, specificRouteMiddlewares)
        routes[baseOfRequest][method][rest].handler(req,res)
      }catch(errorFromHandler){
        try{
          routes[baseOfRequest][method][rest].errHandler(req,res,errorFromHandler)
        }catch(errorFromErrHandler){
          try{
            routes[baseOfRequest].routerErrorHandler(req,res,errorFromHandler, errorFromErrHandler)
          }catch(errFromRouterErrorHandler){
            defaultHandler(req,res, errorFromHandler, errorFromErrHandler, errFromRouterErrorHandler)
          }
        }
      }
    }
    return Listen(http, handler)
  }
})



// test handler for express middlewares...
function midHandler(req, res, arr){
  function next(resolve, reject, ...args){
    if(args.length > 0) return reject(args[0])
    return resolve()
  }
  return Promise.mapSeries(arr, item=>{
    return new Promise((resolve, reject)=>{
      item(req,res,next.bind(this,resolve, reject))
    })
  })
}

const CreateMiddleWare = (middleWareArr, chainLink) => ({
  middleware:fn=>{middleWareArr.push(fn);return chainLink}
})


// main instance creator, returns a func which expects an http object and creates an instance
const ExpAppCreator = (Router, Listen, urlUtil, defaultHandler, midHandler) => {
  return createInstanceFactory = (http) => {
    const Instance = {}
    const middleWares = []
    return Object.assign(
      Instance,
      CreateRouter(Router),
      RegisterRouters(http, Listen,urlUtil, defaultHandler, middleWares, midHandler),
      CreateMiddleWare(middleWares, Instance),
      CreatePath()
    )
  }
}


let exp = ExpAppCreator(Router, Listen, urlUtil, defaultHandler, midHandler)(http)

const apiRouter = exp.createRouter('/api')
const authRouter = exp.createRouter('/auth')

const errHandlerForAPi = function(req,res,e1,e2){
  res.writeHead(404)
  res.write(e1.toString())
  res.write(e2.toString())
  res.end()
}

const getLogin = exp.createPath()
const getLogin2 = exp.createPath()

getLogin
  .path('/login')
  .middleware((req,res,next)=>{console.log('middleware1');next()})
  .middleware((req,res,next)=>{console.log('middleware2');next()})
  .handler((req,res)=>{
    res.writeHead(200)
    res.write('this is from loginnn')
    res.end()
  })
  .errHandler((req,res,err)=>{
    console.log('err from login')
    res.end()
  })


getLogin2
  .path('/login2')
  .middleware((req,res,next)=>{console.log('middleware1');next()})
  .middleware((req,res,next)=>{console.log('middleware2');next()})
  .handler((req,res)=>{
    res.writeHead(200)
    res.write('this is from loginnn')
    res.end()
  })
  .errHandler((req,res,err)=>{
    console.log('err from login')
    res.end()
  })




apiRouter
  .get(getLogin)
  .get(getLogin2)
  .routerErrorHandler(errHandlerForAPi)

authRouter
  .routerErrorHandler(errHandlerForAPi)
  .middleware(function(req,res,next){console.log('auth router middleware');next()})

exp
  .middleware((req,res,next)=>{console.log(`global middleware`);next()})
  .registerRouters(apiRouter, authRouter)
  .listen(3000, ()=>console.log(`listening on port 3000`))


