// check url, split by /, return split url and method to lower case
const urlUtil = (url, methodUpperCase) => {
  const dividedUrl = url.split('/')
  let method = methodUpperCase.toLowerCase()
  if (method === 'delete') method = 'del'
  let splitRest = dividedUrl.slice(1).map((each) => `/${each}`)
  splitRest.unshift('/')
  splitRest = checkBaseUtil(splitRest)
  return {
    method,
    splitRest
  }
}

// get remote schemas for schema stitching with graphql
const getIntrospectSchema = ({
  HttpLink,
  SubscriptionClient,
  fetch,
  ws,
  getMainDefinition,
  split,
  introspectSchema,
  makeRemoteExecutableSchema
}) => async (remoteSchema) => {
  const httpLink = new HttpLink({ uri: remoteSchema.url, fetch })
  const wsLink = new SubscriptionClient(
    remoteSchema.ws,
    {
      reconnect: true
    },
    ws
  )

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
  )
  const schema = await introspectSchema(httpLink)

  const executableSchema = makeRemoteExecutableSchema({
    schema,
    link
  })

  return executableSchema
}

// used by pretty print to populate object with data received
const populateObjectWithTreeUtil = (entity, options, objectToAddTo, delimiter) => {
  const keysOfEntity = Object.keys(entity)
  for (let key of keysOfEntity) {
    let obj = {}
    for (let option of options) {
      let routeValues = Object.keys(entity[key][option])
      if (routeValues.length > 0) {
        let routeKey = delimiter || option.toUpperCase()
        let value = {}
        for (let route of routeValues) {
          value[route] = ''
          const assignedOption = { [`${[routeKey]}`]: value }
          Object.assign(obj, assignedOption)
          objectToAddTo[key] = obj
        }
      }
    }
  }
}

// recurse on routers object and populate obj passed
const populateSocketRoutersUtil = (obj, routers, parent = null, delimiter) => {
  // console.log(`obj: `, obj, `routers: `, routers, `parent: `, parent)
  const innerRouterObj = {}
  routers.map((router) => {
    let list = router.getObjProps()
    innerRouterObj[parent ? `${parent}${delimiter}${list.base}` : list.base] = list
    // console.log(`inner object`, innerRouterObj)
    if (list.subRouters.length > 0) {
      return populateSocketRoutersUtil(
        obj,
        list.subRouters,
        parent ? (parent += ':' + list.base) : list.base,
        delimiter
      )
    }
  })
  Object.assign(obj, innerRouterObj)
}

// recurse on routers object and populate obj passed
const populateRoutersUtil = (obj, routers, parent = null) => {
  // console.log(obj, routers, parent)
  const innerRouterObj = {}
  routers.map((router) => {
    let list = router.getObjProps()
    innerRouterObj[parent ? `${parent}${list.base}`.replace('//', '/') : list.base] = list
    if (list.subRouters.length > 0) {
      return populateRoutersUtil(obj, list.subRouters, parent ? (parent += list.base) : list.base)
    }
  })
  Object.assign(obj, innerRouterObj)
}

// recurse on sub apps, populate routers and middlewares
const populateSubAppsUtil = (mds, routes, subApps) => {
  subApps.map((subApp) => {
    const data = subApp.getObjProps()
    const _middlewares = data._middleWares
    const _routersObject = data._routersObject
    Object.assign(routes, _routersObject)
    mds.push(_middlewares)
    const innerSubApps = data._subApps
    if (innerSubApps.length > 0) {
      return populateSubAppsUtil(mds, routes, innerSubApps)
    }
  })
}

// nested routers handle test
const populateUrlOptions = (arr) => {
  let startStr = ''
  return arr.map((urlPart) => {
    startStr += urlPart
    startStr = startStr.replace('//', '/')
    return startStr
  })
}

// run on split url receives and check each part of the url, if it is defined
const handleNestedRoutersUtil = (splitUrl, routesObject, combinedRoutersMids = []) => {
  let baseOfRequest
  let rest = null
  let lastDefinedRoute = null
  // check each url in routes obj
  for (let url of splitUrl) {
    // if exists, get middleware
    if (routesObject[url]) {
      lastDefinedRoute = url
      combinedRoutersMids.push(routesObject[url].middleWareArr)
    }
  }
  const indexOfLastRoute = splitUrl.indexOf(lastDefinedRoute)
  baseOfRequest = lastDefinedRoute
  if (baseOfRequest) {
    if (indexOfLastRoute === splitUrl.length - 1) {
      rest = '/'
    } else {
      rest = splitUrl[splitUrl.length - 1]
      rest = rest.substr(baseOfRequest.length)
    }
    if (baseOfRequest === '/') {
      rest = `/${rest}`
    }
    rest = rest.replace('//', '/')
  } else {
    baseOfRequest = '/'
    rest = '/'
  }
  // console.log(`BASE:${baseOfRequest},REST:${rest},LASTURI:${lastDefinedRoute}`)
  // console.log(rest)
  combinedRoutersMids = combinedRoutersMids.reduce((prev, curr) => prev.concat(curr), [])
  return {
    baseOfRequest,
    rest,
    combinedRoutersMids
  }
}

// populate req.query from url
const populateQueryUtil = (req, urlArray) => {
  if (urlArray.includes('?')) {
    urlArray
      .substring(urlArray.indexOf('?') + 1)
      .split('&')
      .map((query) => {
        const keyValue = query.split('=')
        req.query[keyValue[0]] = keyValue[1]
      })
    let urlToReturn = urlArray.substring(0, urlArray.indexOf('?'))
    return checkBaseUtil(urlToReturn)
  }
}

// if //, slice /
const checkBaseUtil = (base) => {
  let newBase
  if (base[base.length - 1] === '/' && base.length > 1) {
    newBase = base.slice(0, base.length - 1)
  } else {
    newBase = base
  }
  return newBase
}

const checkSubRouters = (router, array = []) => {
  router = router.getObjProps ? router.getObjProps() : router
  if (router.middleWareArr.length > 0) {
    array.push(router.middleWareArr)
  }
  if (router.subRouters.length > 0) {
    return router.subRouters.map((router) => checkSubRouters(router, array))
  }
}

// populate params util and replace params to match original route
const populateParamsUtil = (req, routersObject, base, method, rest) => {
  try {
    let param
    let canSkipBecauseParams = false
    if (rest === '/') {
      return { canSkipBecauseParams, param }
    } else {
      let arr = Object.keys(routersObject[base][method])
      for (let path of arr) {
        let splitArr = path.split('/')
        let splitUrl = checkBaseUtil(rest).split('/')
        if (splitArr.length === splitUrl.length) {
          let counter = splitArr.length
          let toBeCounted = 0
          for (let i = 0, len = splitArr.length; i < len; i++) {
            if (splitArr[i].includes(':')) {
              toBeCounted += 1
            } else if (splitArr[i] === splitUrl[i]) {
              toBeCounted += 1
            }
          }
          if (toBeCounted === counter) {
            for (let i = 0, len = splitArr.length; i < len; i++) {
              if (splitArr[i].includes(':')) {
                req.params[splitArr[i].replace(':', '')] = splitUrl[i]
                canSkipBecauseParams = true
              }
            }
            param = path
          }
        }
      }
      return {
        param,
        canSkipBecauseParams
      }
    }
  } catch (e) {
    return {
      param: null,
      canSkipBecauseParams: false
    }
  }
}

// assign nested object properties util
const assign = (obj, keyPath, value) => {
  let lastKeyIndex = keyPath.length - 1
  for (let i = 0; i < lastKeyIndex; ++i) {
    let key = keyPath[i]
    if (!(key in obj)) obj[key] = {}
    obj = obj[key]
  }
  obj[keyPath[lastKeyIndex]] = value
}

export {
  urlUtil,
  populateRoutersUtil,
  populateUrlOptions,
  handleNestedRoutersUtil,
  populateSubAppsUtil,
  checkBaseUtil,
  populateObjectWithTreeUtil,
  populateQueryUtil,
  populateParamsUtil,
  populateSocketRoutersUtil,
  checkSubRouters,
  getIntrospectSchema,
  assign
}
