//TODO remove listen to bliz object and allow multiple register routers
//TODO add sub app implementation
const RegisterRouters = (http, Listen, defaultHandler, midHandler, middleWares, urlUtil, populateRoutersUtil, handleNestedRoutersUtil, populateUrlOptions) => ({
  registerRouters:(...routers)=>{
    // main routes object container
    const routes = {}
    // populate nested routers with routes
    populateRoutersUtil(routes, routers)
    // handler func for http server
    async function handler(req,res){
      // get url parts
      const { method, splitRest } = urlUtil(req)
      let routerMiddlewareHandled = false
      // global middleware, if exists work with it, if throws error go to global handler
      try{
        if(middleWares) await midHandler(Promise, req, res, middleWares)
      }catch(middleWareError){
        return defaultHandler(req,res,middleWareError)
      }

      // check all url combinations possible
      const urlCombinationOptions = populateUrlOptions(splitRest)
      // get last possible route on routes object and get last url part diff,
      // get all middlewares collected on routers existing hit on request
      const {
        baseOfRequest,
        rest,
        nestedRoutersMiddlewaresCombined
      } = handleNestedRoutersUtil(urlCombinationOptions, routes, nestedRoutersMiddlewaresCombined)
      // check routers middleware
      if(nestedRoutersMiddlewaresCombined){
        await midHandler(Promise, req, res, nestedRoutersMiddlewaresCombined)
        routerMiddlewareHandled = true
      }
      // something is not defined go to default handler
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