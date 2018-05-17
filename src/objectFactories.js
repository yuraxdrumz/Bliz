const { pathDescribe, mainDescribe, schemas } = require('./openApi')

// receive an http and a handler and return a listen func
const Listen = (handlerFactory, _useSockets, http, _socketRoutersObject) => ({
  createServer:(...args)=>{
    const { handler } = handlerFactory()
    const server = http.createServer(handler)
    return server
  },
  // listen: (...args) => {
  //   const { handler } = handlerFactory()
  //   const server = http.createServer(handler)
  //   return server.listen.apply(server, args)
  // },
  listen: (...args) => {
    const { handler } = handlerFactory()
    const server = http.createServer(handler)
    if(_useSockets.enabled && _useSockets.io){
      const injectedIo = _useSockets.io(server)
      server.listen.apply(server, args)
      // injectedIo.on('connction', )
      injectedIo.on('connection', (socket)=>{
      
        const routersKeys = Object.keys(_socketRoutersObject)
        for(let key of routersKeys){
          const eventKeys = Object.keys(_socketRoutersObject[key].event)
          for(let eventKey of eventKeys){
            // _socketRoutersObject[key].event[eventKey].handler()
            socket.on(`${key}${_useSockets.delimiter}${eventKey}`, (msg, cb)=>{
              _socketRoutersObject[key].event[eventKey].getObjProps().handler(injectedIo, socket, msg, cb)
            })
          }
      
          // socket.on()
        }
        console.log(socket.id, ' connected')

        socket.on('disconnect', ()=>{
          console.log(socket.id, 'disconnected ')
        })

      })

      return injectedIo
    } else {
      return server.listen.apply(server, args)
    }
  }
})

// pretty print all app routes
const PrettyPrint = (treeifyDep, entity, socketEntity, chainLink) =>({
  prettyPrintSocket: (logger = console.log) =>{
    let shortEntity = {}
    let options = ['event']
    const keysOfEntity = Object.keys(socketEntity)
    for(let key of keysOfEntity){
      let obj = {}
      for(let option of options){
        let routeValues = Object.keys(socketEntity[key][option])
        if(routeValues.length > 0){
          let routeKey = option.toUpperCase()
          let value = {}
          for(let route of routeValues){
            value[route] = ''
            const assignedOption = {[routeKey]:value}
            Object.assign(obj,assignedOption)
            shortEntity[key] = obj
          }
        }
      }
    }
    logger(treeifyDep.asTree(shortEntity))
    return chainLink
  },
  prettyPrint: (logger = console.log) =>{
    let shortEntity = {}
    let options = ['get','post','put','del', 'event']
    const keysOfEntity = Object.keys(entity)
    for(let key of keysOfEntity){
      let obj = {}
      for(let option of options){
        let routeValues = Object.keys(entity[key][option])
        if(routeValues.length > 0){
          let routeKey = option.toUpperCase()
          let value = {}
          for(let route of routeValues){
            value[route] = ''
            const assignedOption = {[routeKey]:value}
            Object.assign(obj,assignedOption)
            shortEntity[key] = obj
          }
        }
      }
    }
    logger(treeifyDep.asTree(shortEntity))
    return chainLink
  }
})

// method creator for router
const Method = (name, object, chainLink) => ({
  [name]: data =>{
    data.parent = chainLink.getObjProps()
    object[name][data.getObjProps().path] = data
    return chainLink
  }
})

// create swagger yaml
const CreateSwagger = (yamlCreator, chainLink, fs, ...args) => ({
  swagger:(swaggerOptions)=>{
    const swaggerObj = {}
    args.map(arg=>Object.assign(swaggerObj, arg))
    const swaggerYaml = yamlCreator(swaggerObj)
    let yaml = ''
    
    const {_routersObject, _describe } = chainLink.getObjProps()
    const mainYaml = yamlCreator(mainDescribe(_describe))
    yaml+=mainYaml
    const routersKeys = Object.keys(_routersObject)
    const mainPathsObject = {paths:{}}
    const schemasObject = []
    for(let key of routersKeys){
      const options = ['get', 'post', 'put', 'del']
      const router = _routersObject[key]
      for(let method of options){
        const paths = Object.keys(router[method])
        for(let path of paths){
          const fullPath = router.base + path
          const describe = router[method][path].getObjProps().describe
          const responseObjectsForSchema = describe.incoming.filter(request=>request.in === 'body')
          if(responseObjectsForSchema.length > 0){
            responseObjectsForSchema.map(response=>{
              const obj = {}
              const name = `${fullPath.replace(/\//g, '').replace(/-/,'').replace(/[:]/g,'')}-body-${method}`
              obj.name = name
              // obj.department = 'requestBodies'
              obj.schema = Object.assign({}, response.schema)
              schemasObject.push(obj)
            })
          }
          describe.outgoing.map(response=>{
            const obj = {}
            const name = `${fullPath.replace(/\//g, '').replace(/-/,'').replace(/[{:}]/g,'')}-${response.status}-${method}`
            obj.name = name
            // obj.department = 'responses'
            obj.schema = Object.assign({}, response.schema)
            schemasObject.push(obj)
          })
          
          const fullObj = Object.assign({}, describe, {method, path: fullPath})
          Object.assign(mainPathsObject.paths, pathDescribe(fullObj))
        }
      }
      yaml += yamlCreator(mainPathsObject)
      yaml += yamlCreator(schemas(schemasObject))
      // console.log(yaml)
      // console.log(swaggerOptions)
      if(swaggerOptions && swaggerOptions.absoluteFilePath){
        fs.writeFileSync(swaggerOptions.absoluteFilePath, yaml, 'utf8')
      }
    }
    return chainLink
  }
})


// assign creator
const AssignHandler = (name, object, chainLink, override = false) =>({
  [name]: data =>{
    // console.log(`DATA BEFORE: `, name, object, data)
    override ? Object.assign(object, data) : object[name] = data
    // console.log(`DATA AFTER: `, object, name, data)
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
  EventsCreator,
  CreateSwagger
}