const { pathDescribe, mainDescribe, schemas } = require('./openApi')
// receive an http and a handler and return a listen func
const Listen = (name, handlerFactory, http) => ({
  [name]: (...args) => {
    const { handler } = handlerFactory()
    const server = http.createServer(handler)
    return server.listen.apply(server, args)
  }
})


const PrettyPrint = (treeifyDep, entity, chainLink) =>({
  prettyPrint: log =>{
    let logger = console.log
    let shortEntity = {}
    const keysOfEntity = Object.keys(entity)

    if(log && typeof log === 'function') logger = log

    for(let key of keysOfEntity){
      let obj = {}
      let options = ['get','post','put','del']
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
const Method = (name, object,chainLink) => ({
  [name]: data =>{
    data.parent = chainLink.getObjProps()
    object[name][data.getObjProps().path] = data
    return chainLink
  }
})

const CreateSwagger = (yamlCreator, chainLink, ...args) => ({
  swagger:(options)=>{
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
          const responseObjectsForSchema = describe.requests.filter(request=>request.in === 'body')
          if(responseObjectsForSchema.length > 0){
            responseObjectsForSchema.map(response=>{
              const obj = {}
              const name = `${fullPath.replace(/\//g, '').replace(/-/,'').replace(/[:]/g,'')}-body-${method}`
              obj.name = name
              obj.schema = response.schema
              schemasObject.push(obj)
            })
          }
          describe.responses.map(response=>{
            const obj = {}
            const name = `${fullPath.replace(/\//g, '').replace(/-/,'').replace(/[{:}]/g,'')}-${response.status}-${method}`
            obj.name = name
            obj.schema = response.schema
            schemasObject.push(obj)
          })
          
          const fullObj = Object.assign({}, describe, {method, path: fullPath})
          Object.assign(mainPathsObject.paths, pathDescribe(fullObj))
        }
      }
      yaml += yamlCreator(mainPathsObject)
      yaml += yamlCreator(schemas(schemasObject))
      console.log(yaml)
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