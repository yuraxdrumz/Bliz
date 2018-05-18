const { pathDescribe, mainDescribe, schemas } = require('./openApi')
// receive an http and a handler and return a listen func
const Listen = ({_createHandler, _useSockets, _socketRoutersObject, socketMiddlewareHandler, _injected, _socketMiddlewares, http, print, os, _version}) => ({
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
      const injectedIo = _useSockets.io(server)
      if(args.length > 1){
        server.listen.apply(server, args)
      } else {
        server.listen.apply(server, [
          ()=>print([`Listening on Bliz server ${_version} on port ${args[0]}`,
          `Platform: ${os.platform()}`,
          `Hostname: ${os.hostname()}`,
          `Architecture: ${os.arch()}`,
          `CPU Cores: ${os.cpus().length}`,
          `Memory Free: ${( ((os.freemem()/1024/1024)/(os.totalmem()/1024/1024)) * 100 ).toFixed(0)}%, ${(os.freemem()/1024/1024).toFixed(0)} MB / ${(os.totalmem()/1024/1024).toFixed(0)} MB`,
        ])])        
      }
      // injectedIo.on('connction', )
      injectedIo.on('connection', (socket)=>{
        console.log(socket.id, ' connected')

        const routersKeys = Object.keys(_socketRoutersObject)
        for(let key of routersKeys){
          const eventKeys = Object.keys(_socketRoutersObject[key].event)
          for(let eventKey of eventKeys){
            // _socketRoutersObject[key].event[eventKey].handler()
            socket.on(`${key}${_useSockets.delimiter}${eventKey}`, async (msg, cb)=>{
              const chosenEvent = _socketRoutersObject[key].event[eventKey].getObjProps()
              // if()
              if(_socketMiddlewares && _socketMiddlewares.length > 0){
                await socketMiddlewareHandler(Promise, injectedIo, socket, msg, cb, _socketMiddlewares)
              }
              if(_socketRoutersObject[key].middleWareArr && _socketRoutersObject[key].middleWareArr.length > 0){
                await socketMiddlewareHandler(Promise, injectedIo, socket, msg, cb, _socketRoutersObject[key].middleWareArr)
              }
              if(chosenEvent.middleWareArr && chosenEvent.middleWareArr.length > 0){
                await socketMiddlewareHandler(Promise, injectedIo, socket, msg, cb, chosenEvent.middleWareArr)
              }
              chosenEvent.handler(injectedIo, socket, msg, cb, _injected)
            })
          }
      
          // socket.on()
        }

        socket.on('disconnect', ()=>{
          console.log(socket.id, 'disconnected ')
        })

      })

      return injectedIo
    } else {
      if (args.length > 1) {
        return server.listen.apply(server, args)
      } else {
        return server.listen.apply(server, [
          ()=>print([`Listening on Bliz server ${_version} on port ${args[0]}`,
          `Platform: ${os.platform()}`,
          `Hostname: ${os.hostname()}`,
          `Architecture: ${os.arch()}`,
          `CPU Cores: ${os.cpus().length}`,
          `Memory Free: ${( ((os.freemem()/1024/1024)/(os.totalmem()/1024/1024)) * 100 ).toFixed(0)}%, ${(os.freemem()/1024/1024).toFixed(0)} MB / ${(os.totalmem()/1024/1024).toFixed(0)} MB`
        ])])         
      }
    }
  }
})

// pretty print all app routes
const PrettyPrint = (treeifyDep, entity, socketEntity, chainLink, _useSockets, _loggerEntity, populateObjectWithTreeUtil) =>({
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
const CreateSwagger = (yamlCreator, chainLink, fs, ...args) => ({
  swagger: swaggerOptions => {
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