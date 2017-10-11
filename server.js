const http = require('http')

const Listen = (http, handler) => ({
  listen:(...args)=>{
    const server = http.createServer(handler)
    return server.listen.apply(server, args)
  }
})

const Router = basePath => {
  let getPaths = {}
  let postPaths = {}
  return {
    get: route => {
      getPaths[route.path] = route
    },
    post: route => {
      postPaths[route.path] = route
    },
    listRoutes:()=>{
      return {
        basePath,
        getPaths,
        postPaths
      }
    },
    register:()=>{
      return {
        getPaths,
        postPaths
      }
    }
  }
}

const createRouter = Router => ({
  Router: basePath =>{
    return Object.assign(
      {},
      Router(basePath)
    )
  }

})

const makeRoutesReadyForHandler = router =>{
  const getPaths = Object.keys(router.getPaths)
  const postPaths = Object.keys(router.postPaths)
  const basePath = `${router.basePath}`
  const availableGetPaths = getPaths.map(path=>({method:'GET',path:`${basePath}${path}`,handler:router.getPaths[path].handler}))
  const availablePostPaths = postPaths.map(path=>({method:'POST',path:`${basePath}${path}`,handler:router.postPaths[path].handler}))
  const allRoutes = availableGetPaths.concat(availablePostPaths)
  return allRoutes
}

const RegisterHandlers = (http, Listen) => ({
  registerHandlers:(...routers)=>{
    const routersList = routers
      .map(router=>router.listRoutes())
      .map(makeRoutesReadyForHandler)
      .reduce((prev, curr)=>prev.concat(curr))

    const handler = function(req,res){
      let handled = false
      routersList.forEach(route=>{
        if(req.url === route.path && req.method.toLowerCase() === route.method.toLowerCase()){
          route.handler(req,res)
          handled = true
        }
      })
      if(!handled){
        res.writeHead(404)
        res.write('Route not found')
        res.end()
      }

    }
    return Listen(http, handler)
  }
})


const createInstanceFactory = (http) => {
  return Object.assign(
    {},
    createRouter(Router),
    RegisterHandlers(http, Listen)
  )
}

let exp = createInstanceFactory(http, function(req,res){})

const apiRouter = exp.Router('/api')
const authRouter = exp.Router('/auth')
const apiMainRoute = {
  path:'/getData',
  handler:(req,res)=>{
    res.write('this is api main route')
    res.end()
  }
}
const authMainRoute = {
  path:'/login',
  handler:(req,res)=>{
    res.write('this is auth main route')
    res.end()
  }
}
apiRouter.get(apiMainRoute)
authRouter.post(authMainRoute)
exp
  .registerHandlers(apiRouter, authRouter)
  .listen(3000, ()=>console.log(`listening on port 3000`))



