function urlUtil(url, methodUpperCase){
  if(url.includes('?')){
    let split = url.split(/(\?)/g)
    for(let i=0,len=split.length;i<len;i++){
      if(split[i].includes('?') && split[i-1][split[i-1].length -1] !== '/'){
        split[i-1] = split[i-1] + '/'
      }
    }
    url = split.join('')
  }
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
function handleNestedRoutersUtil(splitUrl, routesObject, combinedRoutersMids = []){
  let baseOfRequest
  let rest = null
  let lastDefinedRoute = null
  // check each url in routes obj
  for(let url of splitUrl){
    // if exists, get middleware
    if(routesObject[url]){
      lastDefinedRoute = url
      combinedRoutersMids.push(routesObject[url].middleWareArr)
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
  combinedRoutersMids = combinedRoutersMids.reduce((prev,curr)=>prev.concat(curr), [])
  return {
    baseOfRequest,
    rest,
    combinedRoutersMids
  }
}

function populateQueryUtil(req, urlArray){
  if(urlArray.includes('?')){
    urlArray
      .substring(urlArray.indexOf('?') +1)
      .split('&')
      .map(query=>{
        const keyValue = query.split('=')
        req.query[keyValue[0]] = keyValue[1]
      })
    return urlArray.substring(0, urlArray.indexOf('?'))
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

function populateParamsUtil(req, routersObject, base, method, rest){
  try{
    let param
    let canSkipBecauseParams = false
    if(rest === '/'){
      return { canSkipBecauseParams, param }
    }else{
      let arr = Object.keys(routersObject[base][method])
      for(let path of arr){
        let splitArr = path.split('/')
        let splitUrl = checkBaseUtil(rest).split('/')
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
      return {
        param,
        canSkipBecauseParams
      }
    }
  }catch(e){
    return {
      param:null,
      canSkipBecauseParams:false
    }
  }
}

export {
  urlUtil,
  populateRoutersUtil,
  populateUrlOptions,
  handleNestedRoutersUtil,
  populateSubAppsUtil,
  checkBaseUtil,
  populateQueryUtil,
  populateParamsUtil
}
