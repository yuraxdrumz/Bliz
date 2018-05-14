// main function
function createHandler (request, response, defaultHandler, midHandler, Joi, urlUtil, handleNestedRoutersUtil,populateParamsUtil, populateQueryUtil, populateUrlOptions, middleWares, routes, injected, app, Promise) {
  // receive all middlewares from routers and apps if exist and concatanate them
  middleWares = middleWares.reduce((prev, curr) => prev.concat(curr), [])
  // handler to be passed to http.createServer
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
    // populate req.query and return the final url to check on routers object
    const finalRest = populateQueryUtil(req, rest) || rest
    // populate req.params and return bool if need to skip param check or not
    const { param, canSkipBecauseParams } = populateParamsUtil(req, routes, baseOfRequest, method, finalRest)
    // global middleware, if exists work with it, if throws error go to global handler
    // check routers middleware
    try {
      // if global middlewares exists, execute them
      if (middleWares){
        await midHandler(Promise, req, res, middleWares)
      }
      // if routers middlewares exist, execute them
      if (combinedRoutersMids) {
        await midHandler(Promise, req, res, combinedRoutersMids)
      }
    } catch (middleWareError) {
      // in case of error in middlewares call defualt handler
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
    // try router middleware => route middleware=> route handler=> if err check route err handler=>
    // if err in err handler or err handler not exists => router err handler => if not go to global handler
    try {
      const { middleWareArr, describe, handler } = currentRoute
      // if route middleware, execute
      if (middleWareArr && middleWareArr.length > 0){
        await midHandler(Promise, req, res, middleWareArr)
      }
      // if validation schemes exist, execute them
      if(describe && describe.requests && describe.requests.length > 0){
        for(let i=0; i<describe.requests.length; i++){
          describe.requests[i].schema(req[describe.requests[i].in])
        }
      }
      // call handler with req, res and injected object from app.inject      
      handler(req, res, injected)
    } catch (errorFromHandler) {
      // here, it is the same as with middlewares but backwards, try route err handler, next up try router err handler and finally try global middleware
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
