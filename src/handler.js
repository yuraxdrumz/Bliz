// TODO check path to regex
// TODO add cluster support
// TODO add auto generated swagger from routes support
function createHandler (request, response, defaultHandler, midHandler, urlUtil, handleNestedRoutersUtil, populateUrlOptions, middleWares, routes) {
  async function handler(req,res){
    req.__proto__ = request
    res.__proto__ = response
    if(!req.params) req.params = {}
    // get url parts
    const { method, splitRest } = urlUtil(req.url, req.method)
    // global middleware, if exists work with it, if throws error go to global handler
    try {
      if (middleWares) await midHandler(Promise, req, res, middleWares)
    } catch (middleWareError) {
      return defaultHandler(req, res, middleWareError)
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
    if (nestedRoutersMiddlewaresCombined) {
      await midHandler(Promise, req, res, nestedRoutersMiddlewaresCombined)
    }

    // handle params
    let canSkipBecauseParams = false
    let param
    try{
      param = Object.keys(routes[baseOfRequest][method])[0]
      if(param && param.includes(':')){
        let splitParam = param.split('/')
        let splitRestAfter = rest.split('/')
        // console.log(`PARAM:${splitParam},RESTAFTER:${splitRestAfter}`)
        if(splitParam.length === splitRestAfter.length){
          for(let i=0,len=splitParam.length;i<len;i++){
            if(splitParam[i].includes(':')){
              req.params[ splitParam[i].replace(':','') ] = splitRestAfter[i]
              canSkipBecauseParams = true
            }
          }
        }
      }
    }catch(e){console.error(e)}
    // console.log(req.params)
    // console.log(splitParam, splitRestAfter)
    // something is not defined go to default handler
    if(!canSkipBecauseParams){
      if (!routes[baseOfRequest])return defaultHandler(req, res)
      if (!routes[baseOfRequest][method])return defaultHandler(req, res)
      if (!routes[baseOfRequest][method][rest]) return defaultHandler(req, res)
    }
    // current route after all checks
    const currentRoute = routes[baseOfRequest][method][!canSkipBecauseParams ? rest : param ].getObjProps()
    // try router middleware => route middleware=>route handler=>if err check route err handler=>
    // if err in err handler or err handler not exists => router err handler => if not go to global handler
    try {
      const specificRouteMiddlewares = currentRoute.middleWareArr
      if (specificRouteMiddlewares) await midHandler(Promise, req, res, specificRouteMiddlewares)
      currentRoute.handler(req, res)
    } catch (errorFromHandler) {
      try {
        currentRoute.errHandler(req, res, errorFromHandler)
      } catch (errorFromErrHandler) {
        try {
          routes[baseOfRequest].routerErrorHandler(req, res, errorFromHandler, errorFromErrHandler)
        } catch (errFromRouterErrorHandler) {
          defaultHandler(req, res, errorFromHandler, errorFromErrHandler, errFromRouterErrorHandler)
        }
      }
    }
  }
  return handler
}

export default createHandler
