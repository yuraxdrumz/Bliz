function urlUtil(url, methodUpperCase){
  const dividedUrl = url.split('/');
  let method = methodUpperCase.toLowerCase()
  if(method === 'delete') method = 'del'
  let splitRest = dividedUrl.slice(1).map(each=>`/${each}`)
  splitRest.unshift('/')
  if(splitRest.length > 1 && splitRest[splitRest.length - 1] === '/' && splitRest.length>1) splitRest = splitRest.slice(0,splitRest.length -1)
  return {
    method,
    splitRest
  }
}

function populateRoutersUtil(obj, routers, parent = null){
  const innerRouterObj = {}
  routers.map( router => {
    let list = router.getObjProps()
    innerRouterObj[parent ? `${parent}${list.base}`.replace('//','/') : list.base] = list
    if(list.subRouters.length > 0){
      return populateRoutersUtil(obj, list.subRouters, parent ? parent += list.base : list.base)
    }
  })
  Object.assign(obj, innerRouterObj)
}

function populateSubAppsUtil(mds, routes, subApps){
  subApps.map(subApp=>{
    const data = subApp.getObjProps()
    const middlewares = data.middleWares
    const routersObject = data.routersObject
    Object.assign(routes, routersObject)
    mds.push(middlewares)
    const innerSubApps = data.subApps
    if(innerSubApps.length > 0){
      return populateSubAppsUtil(mds, routes, innerSubApps)
    }
  })

}

// nested routers handle test
function populateUrlOptions(arr){
  let startStr = ''
  return arr.map( urlPart => {
    startStr += urlPart
    startStr = startStr.replace('//','/')
    return startStr
  })
}
function handleNestedRoutersUtil(splitUrl, routesObject, nestedRoutersMiddlewaresCombined = []){
  let baseOfRequest
  let rest = null
  let lastDefinedRoute = null
  // check each url in routes obj
  for(let url of splitUrl){
    // if exists, get middleware
    if(routesObject[url]){
      lastDefinedRoute = url
      nestedRoutersMiddlewaresCombined.push(routesObject[url].middleWareArr)
    }
  }
  const indexOfLastRoute = splitUrl.indexOf(lastDefinedRoute)
  baseOfRequest = lastDefinedRoute
  if(baseOfRequest){
    if(indexOfLastRoute === splitUrl.length -1){
      rest = '/'
    }else{
      rest = splitUrl[splitUrl.length - 1]
      rest = rest.substr(baseOfRequest.length)
    }
    if(baseOfRequest === '/'){
      rest = `/${rest}`
    }
    rest = rest.replace('//','/')
  }else{
    baseOfRequest = '/'
    rest = '/'
  }
  // console.log(`BASE:${baseOfRequest},REST:${rest},LASTURI:${lastDefinedRoute}`)
  // console.log(rest)
  nestedRoutersMiddlewaresCombined = nestedRoutersMiddlewaresCombined.reduce((prev,curr)=>prev.concat(curr), [])
  return {
    baseOfRequest,
    rest,
    nestedRoutersMiddlewaresCombined
  }
}

function checkBaseUtil(base){
  let newBase
  if(base[base.length - 1] === '/' && base.length > 1) {
    newBase = base.slice(0, base.length - 1)
  }else{
    newBase = base
  }
  return newBase
}

export {
  urlUtil,
  populateRoutersUtil,
  populateUrlOptions,
  handleNestedRoutersUtil,
  populateSubAppsUtil,
  checkBaseUtil
}
