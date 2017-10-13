const urlUtil = req => {
  const dividedUrl = req.url.split('/');
  let method = req.method.toLowerCase()
  if(method === 'delete') method = 'del'
  let splitRest = dividedUrl.slice(1).map(each=>`/${each}`)
  if(splitRest[splitRest.length - 1] === '/') splitRest = splitRest.slice(0,splitRest.length -1)
  return {
    method,
    splitRest
  }
}

function populateRoutersUtil(obj, routers, parent = null){
  const innerRouterObj = {}
  routers.map((router, index)=>{
    let list = router.getObjProps()
    if(parent){
      innerRouterObj[`${parent}${list.base}`] = list
    }else{
      innerRouterObj[list.base] = list
    }
    if(list.subRouters.length > 0){
      if(parent){
        parent+=list.base
        return populateRoutersUtil(obj, list.subRouters, parent)
      }else{
        return populateRoutersUtil(obj, list.subRouters, list.base)
      }

    }
  })
  Object.assign(obj, innerRouterObj)
}

// nested routers handle test
function populateUrlOptions(arr){
  let startStr = ''
  return arr.map(urlPart=>{
    startStr+=urlPart
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
      baseOfRequest = splitUrl[i-1]
      rest = splitUrl[i].substr(baseOfRequest.length)
    }
  }
  nestedRoutersMiddlewaresCombined = nestedRoutersMiddlewaresCombined.reduce((prev,curr)=>prev.concat(curr))
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
  handleNestedRoutersUtil
}