// TODO check path to regex
// TODO add auto generated swagger from routes support
// TODO add default middleware ???
// TODO clean handler and test for performance
// TODO add tests
// TODO merge events of subapps to main app
function createHandler (request, response, defaultHandler, midHandler, Joi, urlUtil, handleNestedRoutersUtil,populateParamsUtil, populateQueryUtil, populateUrlOptions, middleWares, routes, injected, app, Promise) {
  middleWares = middleWares.reduce((prev, curr) => prev.concat(curr), [])
  async function handler(req,res){
    // set proto of req and res to point to our req and res
    req.__proto__ = request
    res.__proto__ = response
    if(!req.params) req.params = {}
    if(!req.query) req.query = {}
    // get url parts
    let { method, splitRest } = urlUtil(req.url, req.method)
    // check all url combinations possible
    const urlCombinationOptions = populateUrlOptions(splitRest)
    // get all middlewares collected on routers existing hit on request
    const { baseOfRequest, rest, combinedRoutersMids } = handleNestedRoutersUtil(urlCombinationOptions, routes)
    // handle params
    const finalRest = populateQueryUtil(req, rest) || rest
    const { param, canSkipBecauseParams } = populateParamsUtil(req, routes, baseOfRequest, method, finalRest)
    // global middleware, if exists work with it, if throws error go to global handler
    // check routers middleware
    try {
      if (middleWares){
        app.events.emit('global_middleware:start')
        await midHandler(Promise, req, res, middleWares)
        app.events.emit('global_middleware:finish')
      }
      if (combinedRoutersMids) {
        app.events.emit(`router_middleware:start`, baseOfRequest)
        await midHandler(Promise, req, res, combinedRoutersMids)
        app.events.emit(`router_middleware:finish`, baseOfRequest)
      }
    } catch (middleWareError) {
      return defaultHandler(req, res, middleWareError)
    }

    // something is not defined go to default handler
    if(!canSkipBecauseParams){
      if (!routes[baseOfRequest])return defaultHandler(req, res)
      if (!routes[baseOfRequest][method])return defaultHandler(req, res)
      if (!routes[baseOfRequest][method][finalRest]) return defaultHandler(req, res)
    }
    // current route after all checks
    const currentRoute = routes[baseOfRequest][method][!canSkipBecauseParams ? finalRest : param ].getObjProps()
    // try router middleware => route middleware=>route handler=>if err check route err handler=>
    // if err in err handler or err handler not exists => router err handler => if not go to global handler
    try {
      const { middleWareArr, describe, handler } = currentRoute
      if (middleWareArr && middleWareArr.length > 0){
        app.events.emit(`path_middleware:start`, rest)
        await midHandler(Promise, req, res, middleWareArr)
        app.events.emit(`path_middleware:finish`, rest)
      }
      if(describe && describe.requests && describe.requests.length > 0){
        for(let i=0; i<describe.requests.length; i++){
          describe.requests[i].schema(req[describe.requests[i].name])
        }
      }
      app.events.emit(`validation_schemas:finish`)
      
      handler(req, res, injected)
    } catch (errorFromHandler) {
      try{
        if(currentRoute.errHandler){
          currentRoute.errHandler(req, res, errorFromHandler)
        }else if(routes[baseOfRequest].routerErrorHandler){
          routes[baseOfRequest].routerErrorHandler(req, res, errorFromHandler)
        }else{
          defaultHandler(req, res, errorFromHandler)
        }
      }catch(errorFromErrorHandlers){
        defaultHandler(req, res, errorFromErrorHandlers)
      }

    }
  }
  return { handler }
}

export default createHandler
