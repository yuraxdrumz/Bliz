// receive an http and a handler and return a listen func
const Listen = (http, handler, middleWares, routes, subApps, populateSubAppsUtil) => ({
  listen:(...args)=>{
    populateSubAppsUtil(middleWares, routes, subApps)
    middleWares = middleWares.reduce((prev,curr)=>prev.concat(curr),[])
    const handlerWithRoutes = handler(middleWares, routes, subApps)
    const server = http.createServer(handlerWithRoutes)
    return server.listen.apply(server, args)
  }
})

const PrettyPrint = (treeifyDep, entity) =>({
  prettyPrint:()=>{
    let shortEntity = {}
    if(Object.keys(entity).length > 0){
      for(let i=0,len=Object.keys(entity).length;i<len;i++){
        let obj = {}
        let key = Object.keys(entity)[i]
        shortEntity[key] = obj
        let options = ['get','post','put','del']
        options.forEach(option=>{
          let val = Object.keys(entity[key][option])
          if(val.length > 0){
            Object.assign(obj, {[option.toUpperCase()]:{[val[0]]:''}})
          }
        })
        // Object.assign(shortEntity, obj)
      }
    }
    return treeifyDep.asTree(shortEntity)
  }
})

// method creator for router
const Method = (name, object,chainLink) => ({
  [name]: data =>{
    object[name][data.getObjProps().path] = data
    return chainLink
  }
})


// assign creator
const AssignHandler = (name, object, chainLink) =>({
  [name]:data =>{
    object[name] = data
    return chainLink
  }
})


// list object properties
const GetObjProps = obj =>({
  getObjProps:()=>(obj)
})

// when called, receives an object
// returns new object
const CreateNewObjOf = (name, obj, ...deps) => ({
  [`create${name}`]: data =>{
    return Object.assign(
      {},
      obj(data, deps)
    )
  }
})
// pushes data to array
const CreateArray = (name, arr, chainLink) => ({
  [name]:data=>{
    arr.push(data)
    return chainLink
  }
})


export {
  AssignHandler,
  CreateArray,
  CreateNewObjOf,
  Method,
  GetObjProps,
  Listen,
  PrettyPrint
}