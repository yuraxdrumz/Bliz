// receive an http and a handler and return a listen func
const Listen = (dependencies) => ({
  createServer: (...args) => {
    const { http: { createServer }, _createHandler } = dependencies
    const { handler } = _createHandler()
    const server = createServer(handler)
    return server
  },
  listen: (...args) => {
    const { http: { createServer }, io, socketHandler, graphqlHandler, _createHandler, _useSockets, _version, _useGraphql, _Instance, print, os } = dependencies
    const { handler } = _createHandler()
    const server = createServer(handler)
    if (_useSockets.useSockets) {
      _useSockets.io = io
      return socketHandler({server, args, ...dependencies})
    } else if (_useGraphql.useGraphql){
      return graphqlHandler({server, args, ...dependencies})
    } 
    else {
      _Instance.events.emit('log')
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
const PrettyPrint = ({_useHttp, _useSockets, _Instance, _loggerEntity, populateObjectWithTreeUtil, treeify}) => ({
  prettyPrint: (logger = console.log) =>{
    _Instance.events.once('log', ()=> setImmediate(()=>{
      populateObjectWithTreeUtil(_useHttp._routersObject, ['get','post','put','del'], _loggerEntity.http)
      populateObjectWithTreeUtil(_useSockets._socketRoutersObject, ['event'], _loggerEntity.sockets, _useSockets.delimiter)
      logger(treeify.asTree(_loggerEntity))
    }, 0))
    return _Instance
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
const CreateSwagger = ({_useHttp, _Instance, stringify, mainDescribe, _describe, pathDescribe, schemas, fs }) => ({
  swagger: (swaggerOptions) => {
    let yaml = ''
    _useHttp.swagger = true
    const { _routersObject, _describe } = _useHttp
    yaml += stringify(mainDescribe(_describe))
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
      yaml += stringify(mainPathsObject)
      yaml += stringify(schemas(schemasObject))
      // console.log(yaml)
      // console.log(swaggerOptions)
      if (swaggerOptions && swaggerOptions.absoluteFilePath) {
        fs.writeFileSync(swaggerOptions.absoluteFilePath, yaml, 'utf8')
      }
    }
    return _Instance
  }
})


// assign creator
const AssignHandler = ({name, obj, chainLink, override = false}) =>({
  [name]: data =>{
    override ? Object.assign(obj, data) : obj[name] = data
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
const CreateNewObjOf = ({name, obj, dependencies = {}}) => ({
  [`create${name}`]: data =>{
    return Object.assign(
      {},
      obj(data, ...dependencies)
    )
  }
})
// pushes data to array
const CreateArray = ({name, arr, chainLink}) => ({
  [name]: data => {
    arr.push(data)
    return chainLink
  }
})

// pushes data to array
const CreateObjectArray = ({name, arr, chainLink}) => ({
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
