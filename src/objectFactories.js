const { pathDescribe, mainDescribe, schemas } = require('./openApi')

// receive an http and a handler and return a listen func
const Listen = (handlerFactory, socket, http, deps) => ({
  listen: (...args) => {
    const { handler } = handlerFactory(deps)
    const server = http.createServer(handler)
    if(socket.enabled && socket.io){
      const injectedIo = socket.io(server)
      server.listen.apply(server, args)
      return injectedIo
    } else {
      return server.listen.apply(server, args)
    }
  }
})

// pretty print all app routes
const PrettyPrint = (treeifyDep, entity, chainLink) =>({
  prettyPrint: (logger = console.log) =>{
    let shortEntity = {}
    let options = ['get','post','put','del']
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
  [name]:data =>{
    override ? Object.assign(object, data) : object[name] = data
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