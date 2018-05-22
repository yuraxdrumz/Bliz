const { pathDescribe, mainDescribe, schemas } = require('./http/openApi')
// receive an http and a handler and return a listen func
const Listen = ({_createHandler, checkSubRouters, _useGraphql, _useSockets, socketHandler, handleNestedSocketRoutersUtil, _socketRoutersObject, socketMiddlewareHandler, _injected, _Instance, _socketMiddlewares, http, print, os, _version}) => ({
  createServer:(...args)=>{
    const { handler } = _createHandler()
    const server = http.createServer(handler)
    return server
  },
  // listen: (...args) => {
  //   const { handler } = handlerFactory()
  //   const server = http.createServer(handler)
  //   return server.listen.apply(server, args)
  // },
  listen: (...args) => {
    const { handler } = _createHandler()
    const server = http.createServer(handler)
    if(_useSockets.enabled && _useSockets.io){
      return socketHandler({_useSockets, server, _version, args, os, _socketRoutersObject, _socketMiddlewares, _injected, socketMiddlewareHandler, checkSubRouters, print})
    } 
    else {
      if (args.length > 1) {
        return server.listen.apply(server, args)
      } else {
        return server.listen.apply(server, [
          args[0],
          ()=>print([`Listening on Bliz server ${_version} on port ${args[0]}`,
          `Platform: ${os.platform()}`,
          `Hostname: ${os.hostname()}`,
          `Architecture: ${os.arch()}`,
          `CPU Cores: ${os.cpus().length}`,
          `Memory Free: ${( (os.freemem()/os.totalmem()) * 100 ).toFixed(0)}%, ${(os.freemem()/1024/1024).toFixed(0)} MB / ${(os.totalmem()/1024/1024).toFixed(0)} MB`
        ])])         
      }
    }
  }
})

const Cluster = ({_version}) => ({
  // stage 1
    // get options
    // get routers, schemas
    // open redis client
    // ask redis for bliz cluster version
    // if same version - continue
    // else - different versions between cluster servers, throw error (update server)
  // stage 2
    // create server hash
    // write hash to redis
  // stage 3
    // open redis subscriber for divide work
    // open redis subscriber for receive work
  // stage 4
    // when query comes, round robin or options to choose random server (subscribers / hash ??)
    // fire divide work event to chosen server
    // if chosen master
    // divide work totalSchemas / registered servers on cluster
})

// pretty print all app routes
const PrettyPrint = (treeifyDep, _graphQlSchemas, entity, socketEntity, chainLink, _useSockets, _loggerEntity, populateObjectWithTreeUtil) =>({
  prettyPrint: (logger = console.log) =>{
    populateObjectWithTreeUtil(entity, ['get','post','put','del'], _loggerEntity.http)
    populateObjectWithTreeUtil(socketEntity, ['event'], _loggerEntity.sockets, _useSockets.delimiter)
    logger(treeifyDep.asTree(_loggerEntity))
    return chainLink
  }
})

// method creator for router
const Method = (name, object, chainLink) => ({
  [name]: data =>{
    // data.parent = chainLink.getObjProps()
    object[name][data.getObjProps().path] = data
    return chainLink
  }
})

// create swagger yaml
const CreateSwagger = (yamlCreator, chainLink, fs, _useSwagger) => ({
  swagger: swaggerOptions => {
    _useSwagger.enabled = true
    let yaml = ''
    const {_routersObject, _describe } = chainLink.getObjProps()
    yaml += yamlCreator(mainDescribe(_describe))
    const routersKeys = Object.keys(_routersObject)
    const mainPathsObject = {paths: {}}
    const schemasObject = []
    for (let key of routersKeys) {
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
      if (swaggerOptions && swaggerOptions.absoluteFilePath) {
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

const EventsCreator = EventEmitter =>({
  events: new EventEmitter({wildcard: true})
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
  [name]: data => {
    arr.push(data)
    return chainLink
  }
})

// pushes data to array
const CreateObjectArray = (name, arr, chainLink) => ({
  [name]: (fn, timeout = 5000, throwError = true) => {
    arr.push({fn, timeout, throwError})
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
  CreateSwagger,
  CreateObjectArray
}