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
const CreateNewObjOf = (name, obj) => ({
  [`create${name}`]: data =>{
    return Object.assign(
      {},
      obj(data)
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
  Listen
}