// main function
function createHandler({
  request,
  response,
  defaultHandler,
  midHandler,
  urlUtil,
  handleNestedRoutersUtil,
  populateParamsUtil,
  populateQueryUtil,
  populateUrlOptions,
  _injected,
  _Instance,
  Promise,
  _useHttp: { useSwagger, _middleWares, _routersObject, _describe }
}) {
  // receive all middlewares from routers and apps if exist and concatanate them
  _middleWares = _middleWares.reduce((prev, curr) => prev.concat(curr), [])
  // handler to be passed to http.createServer
  async function handler(req, res, next) {
    // set proto of req and res to point to our req and res
    req.__proto__ = request
    res.__proto__ = response
    // expose request and response to each other
    response.req = req
    request.res = res
    if (!req.params) req.params = {}
    if (!req.query) req.query = {}
    // get url parts
    let { method, splitRest } = urlUtil(req.url, req.method)
    // check all url combinations possible
    const urlCombinationOptions = populateUrlOptions(splitRest)
    // get all middlewares collected on routers
    const { baseOfRequest, rest, combinedRoutersMids } = handleNestedRoutersUtil(
      urlCombinationOptions,
      _routersObject
    )
    // populate req.query and return the final url to check on routers object
    const finalRest = populateQueryUtil(req, rest) || rest
    // populate req.params and return bool if need to skip param check or not
    const { param, canSkipBecauseParams } = populateParamsUtil(
      req,
      _routersObject,
      baseOfRequest,
      method,
      finalRest
    )
    // global middleware, if exists work with it, if throws error go to global handler
    // check routers middleware
    try {
      // if global middlewares exists, execute them
      if (_middleWares) {
        await midHandler(Promise, req, res, _middleWares)
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
    if (!canSkipBecauseParams) {
      if (!_routersObject[baseOfRequest]) return defaultHandler(req, res)
      if (!_routersObject[baseOfRequest][method]) return defaultHandler(req, res)
      if (!_routersObject[baseOfRequest][method][finalRest]) return defaultHandler(req, res)
    }
    // current route after all checks
    const currentRoute = _routersObject[baseOfRequest][method][
      !canSkipBecauseParams ? finalRest : param
    ].getObjProps()
    // try router middleware => route middleware=> route handler=> if err check route err handler=>
    // if err in err handler or err handler not exists => router err handler => if not go to global handler
    try {
      const { middleWareArr, describe, handler } = currentRoute
      // if route middleware, execute
      if (middleWareArr && middleWareArr.length > 0) {
        await midHandler(Promise, req, res, middleWareArr)
      }
      // if validation schemes exist, execute them
      if (useSwagger && describe && describe.incoming && describe.incoming.length > 0) {
        for (let i = 0; i < describe.incoming.length; i++) {
          let searchIn = ''
          if (describe.incoming[i].in === 'path') {
            searchIn = 'params'
          } else {
            searchIn = describe.incoming[i].in
          }
          describe.incoming[i].schema(req[searchIn])
        }
      }
      // call handler with req, res and injected object from app.inject
      if (useSwagger && describe && describe.outgoing && describe.outgoing.length > 0) {
        const statusObject = {}
        for (let schema of describe.outgoing) {
          statusObject[schema.status] = schema.schema
        }
        Object.assign(res, { schema: statusObject })
      }

      await handler(req, res, _injected)
    } catch (errorFromHandler) {
      // here, it is the same as with middlewares but backwards, try route err handler, next up try router err handler and finally try global middleware
      try {
        if (currentRoute.errHandler) {
          currentRoute.errHandler(req, res, errorFromHandler)
        } else if (_routersObject[baseOfRequest].routerErrorHandler) {
          _routersObject[baseOfRequest].routerErrorHandler(req, res, errorFromHandler)
        } else {
          defaultHandler(req, res, errorFromHandler)
        }
      } catch (errorFromErrorHandlers) {
        defaultHandler(req, res, errorFromErrorHandlers)
      }
    }
  }
  return { handler }
}

export default createHandler
