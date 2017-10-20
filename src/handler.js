// TODO check path to regex
// TODO add cluster support
// TODO add auto generated swagger from routes support
// TODO add default middleware ???
function createHandler (request, response, defaultHandler, midHandler, Joi, urlUtil, handleNestedRoutersUtil, populateUrlOptions, middleWares, routes) {
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
      let arr = Object.keys(routes[baseOfRequest][method])
      for(let path of arr){
        let splitArr = path.split('/')
        let splitUrl = rest.split('/')
        if(splitArr.length === splitUrl.length){
          let counter = splitArr.length
          let toBeCounted = 0
          for(let i=0,len=splitArr.length;i<len;i++){
            if(splitArr[i].includes(':')){
              toBeCounted+=1
            }else if(!splitArr[i].includes(':') && splitArr[i] === splitUrl[i]){
              toBeCounted+=1
            }
          }
          if(toBeCounted === counter){
            for(let i=0,len=splitArr.length;i<len;i++){
              if(splitArr[i].includes(':')){
                req.params[ splitArr[i].replace(':','') ] = splitUrl[i]
                canSkipBecauseParams = true
              }
            }

            param = path
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
      if(currentRoute.validationSchemas.length>0){
        for(let i=0,len=currentRoute.validationSchemas.length;i<len;i++){
          const currentTest = req[currentRoute.validationSchemas[i].name]
          if(!currentTest) throw new Error(`request object does not have a property: ${JSON.stringify(currentRoute.validationSchemas[i].name)}`)
          const {error, value} = Joi.validate({...currentTest}, currentRoute.validationSchemas[i].schema);
          if(error) throw error
        }

      }
      currentRoute.handler(req, res)
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
  return handler
}

export default createHandler
