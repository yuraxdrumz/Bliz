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
  let baseOfRequest = null
  let rest = null
  // check each url in routes obj
  for(let i=0,len=splitUrl.length;i<len;i++){
    // if exists, get middleware
    if(routesObject[splitUrl[i]]){
      nestedRoutersMiddlewaresCombined.push(routesObject[splitUrl[i]].middleWareArr)
    }else{
      // if not exists go back one route string
      // check request
      baseOfRequest = splitUrl[i-1] || splitUrl[i]
      rest = splitUrl[i].substr(baseOfRequest.length)
    }
  }
  nestedRoutersMiddlewaresCombined = nestedRoutersMiddlewaresCombined.reduce((prev,curr)=>prev.concat(curr), [])
  return {
    baseOfRequest,
    rest,
    nestedRoutersMiddlewaresCombined
  }
}

export {
  urlUtil,
  populateRoutersUtil,
  populateUrlOptions,
  handleNestedRoutersUtil,
  populateSubAppsUtil
}