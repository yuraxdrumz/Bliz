// TODO check path to regex
// TODO add cluster support
// TODO add auto generated swagger from routes support
// TODO add JOI validation
import Joi from 'joi'
function createHandler (request, response, defaultHandler, midHandler, urlUtil, handleNestedRoutersUtil, populateUrlOptions, middleWares, routes) {
  async function handler(req,res){
    req.__proto__ = request
    res.__proto__ = response
    if(!req.params) req.params = {}
    if(!req.query) req.query = {}
    // get url parts
    const { method, splitRest } = urlUtil(req.url, req.method)
    // check all url combinations possible
    const urlCombinationOptions = populateUrlOptions(splitRest)
    // get last possible route on routes object and get last url part diff,
    // get all middlewares collected on routers existing hit on request
    let {
      baseOfRequest,
      rest,
      nestedRoutersMiddlewaresCombined
    } = handleNestedRoutersUtil(urlCombinationOptions, routes, nestedRoutersMiddlewaresCombined)


    // handle params
    let canSkipBecauseParams = false
    let param
    if(rest.includes('?')){
      rest
        .substring(rest.indexOf('?') +1)
        .split('&')
        .map(query=>{
          const keyValue = query.split('=')
          req.query[keyValue[0]] = keyValue[1]
        })

      rest = rest.substring(0, rest.indexOf('?'))
    }

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
    // global middleware, if exists work with it, if throws error go to global handler
    try {
      if (middleWares) await midHandler(Promise, req, res, middleWares)
    } catch (middleWareError) {
      return defaultHandler(req, res, middleWareError)
    }
    // check routers middleware
    if (nestedRoutersMiddlewaresCombined) {
      await midHandler(Promise, req, res, nestedRoutersMiddlewaresCombined)
    }
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
      if(currentRoute.validationSchema){
        const {error, value} = Joi.validate({...req.query,...req.params,...req.body, ...req.headers}, currentRoute.validationSchema);
        if(error) throw error
      }
      currentRoute.handler(req, res)
    } catch (errorFromHandler) {
      try{
        if(currentRoute.errHandler){
          currentRoute.errHandler(req, res, errorFromHandler)
        }else if( routes[baseOfRequest].routerErrorHandler){
          routes[baseOfRequest].routerErrorHandler(req, res, errorFromHandler)
        }else{
          defaultHandler(req, res, errorFromHandler)
        }
      }catch(errorFromErrorHandlers){
        defaultHandler(req, res, errorFromErrorHandlers)
      }

    }
  }
  return handler
}

export default createHandler
