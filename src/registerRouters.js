//TODO add sub router implementation
//TODO remove listen to bliz object and allow multiple register routers
const RegisterRouters = (http, Listen, urlUtil, defaultHandler, midHandler, middleWares) => ({
  registerRouters:(...routers)=>{

    // main routes object container
    const routes = {}
    // get props from each router
    routers.map(router=>{
      let list = router.getObjProps()
      routes[list.base] = list
    })
    // handler func for http server
    async function handler(req,res){
      // get url parts
      const { baseOfRequest, method, rest } = urlUtil(req)
      console.log(baseOfRequest, method, rest)
      let routerMiddlewareHandled = false
      // global middleware, if exists work with it, if throws error go to global handler
      try{
        if(middleWares) await midHandler(Promise, req, res, middleWares)
      }catch(middleWareError){
        return defaultHandler(req,res,middleWareError)
      }
      // if routes dont have entire url in routes object throw default handler, route not found
      // router middleware is used when url base is found, for example: /api/bla, we have /api,
      // so /api middleware will activate
      if(!routes[baseOfRequest]) return defaultHandler(req ,res)
      else {
        const routerMiddlewares = routes[baseOfRequest].middleWareArr
        if(routerMiddlewares){
          await midHandler(Promise, req, res, routerMiddlewares)
          routerMiddlewareHandled = true
        }
      }
      if(!routes[baseOfRequest])return defaultHandler(req ,res)
      if(!routes[baseOfRequest][method])return defaultHandler(req ,res)
      if(!routes[baseOfRequest][method][rest]) return defaultHandler(req ,res)
      // current route after all checks
      const currentRoute = routes[baseOfRequest][method][rest].getObjProps()
      // try router middleware => route middleware=>route handler=>if err check route err handler=>
      // if err in err handler or err handler not exists => router err handler => if not go to global handler
      try{
        if(!routerMiddlewareHandled){
          const routerMiddlewares = routes[baseOfRequest].middleWareArr
          if(routerMiddlewares) await midHandler(Promise, req, res, routerMiddlewares)
        }
        const specificRouteMiddlewares = currentRoute.middleWareArr
        if(specificRouteMiddlewares) await midHandler(Promise, req, res, specificRouteMiddlewares)
        currentRoute.handler(req,res)
      }catch(errorFromHandler){
        try{
          currentRoute.errHandler(req,res,errorFromHandler)
        }catch(errorFromErrHandler){
          try{
            routes[baseOfRequest].routerErrorHandler(req,res,errorFromHandler, errorFromErrHandler)
          }catch(errFromRouterErrorHandler){
            defaultHandler(req,res, errorFromHandler, errorFromErrHandler, errFromRouterErrorHandler)
          }
        }
      }
    }
    // return listen object
    return Listen(http, handler)
  }
})

export default RegisterRouters