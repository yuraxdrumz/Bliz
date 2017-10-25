// receive an http and a handler and return a listen func
const Listen = (name, handlerFactory, middleWares, routes, app) => {
  return http => ({
    [name]: (...args) => {
      const { handler } = handlerFactory(middleWares, routes, app)
      const server = http.createServer(handler)
      return server.listen.apply(server, args)
    }
  })
}

const PrettyPrint = (treeifyDep, entity, chainLink) =>({
  prettyPrint: log =>{
    let logger = console.log
    if(log && typeof log === 'function'){
      logger = log
    }
    let shortEntity = {}
    if(Object.keys(entity).length > 0){
      for(let i=0,len=Object.keys(entity).length;i<len;i++){
        let obj = {}
        let key = Object.keys(entity)[i]
        shortEntity[key] = obj
        let options = ['get','post','put','del']
        options.forEach(option=>{
          let routeValues = Object.keys(entity[key][option])
          if(routeValues.length > 0){
            let routeKey = option.toUpperCase()
            let value = {}
            for(let route of routeValues){
              value[route] = ''
              const assignedOption = {[routeKey]:value}
              Object.assign(obj,assignedOption )
            }

          }
        })
        // Object.assign(shortEntity, obj)
      }
    }
    logger(treeifyDep.asTree(shortEntity))
    return chainLink
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

const EventsCreator = eventEmitter =>({
  events:new eventEmitter({wildcard:true})
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
  PrettyPrint,
  EventsCreator
}