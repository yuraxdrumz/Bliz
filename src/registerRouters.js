const RegisterRouters = (http, Listen, urlUtil, defaultHandler,midHandler, middleWares, Promise, EventEmitter, Request, Response) => ({
  registerRouters:(...routers)=>{
    const routes = {}
    routers.forEach(router=>{let list = router.getObjProps();routes[list.base] = list})
    async function handler(req,res){
      const { baseOfRequest, method, rest } = urlUtil(req)
      try{
        if(middleWares) await midHandler(Promise, req, res, middleWares)
      }catch(middleWareError){
        return defaultHandler(req,res,middleWareError)
      }

      if(!routes[baseOfRequest]) return defaultHandler(req ,res)
      else if(!routes[baseOfRequest])return defaultHandler(req ,res)
      else if(!routes[baseOfRequest][method])return defaultHandler(req ,res)
      else if(!routes[baseOfRequest][method][rest]) return defaultHandler(req ,res)

      const currentRoute = routes[baseOfRequest][method][rest].getObjProps()

      try{
        const routerMiddlewares = routes[baseOfRequest].middleWareArr
        if(routerMiddlewares) await midHandler(Promise, req, res, routerMiddlewares)
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
    Object.assign(handler, EventEmitter.prototype)
    Object.assign(handler, Request, Response)
    return Listen(http, handler)
  }
})

export default RegisterRouters