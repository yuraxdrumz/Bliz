

const socketHandler = ({_useSockets, _Instance, server, _version, args, os, _socketRoutersObject, _injected, _socketMiddlewares, socketMiddlewareHandler, checkSubRouters, print}) => {
    const injectedIo = _useSockets.io(server)
    if(args.length > 1){
      server.listen.apply(server, args)
    } else {
      server.listen.apply(server, [
        args[0],
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
          // console.log(key)
          // _socketRoutersObject[key].event[eventKey].handler()
          // console.log(`registering event : `, `${key}${_useSockets.delimiter}${eventKey}`)
          socket.on(`${key}${_useSockets.delimiter}${eventKey}`, async (msg, cb)=>{    
            try{
              const chosenEvent = _socketRoutersObject[key].event[eventKey].getObjProps()
              // if()
              if(_socketMiddlewares && _socketMiddlewares.length > 0){
                await socketMiddlewareHandler(Promise, injectedIo, socket, msg, cb, _socketMiddlewares)
              }
              // console.log(_socketRoutersObject, key, `${key}${_useSockets.delimiter}${eventKey}`)
              let combinedMiddlewareArray = []
              key
              .split(_useSockets.delimiter)
              .map(prefix => _socketRoutersObject[prefix] ? checkSubRouters(_socketRoutersObject[prefix], combinedMiddlewareArray) : void(0))

              combinedMiddlewareArray = combinedMiddlewareArray.reduce((prev, curr)=>prev.concat(curr))
              // console.log(parentRoutersMiddlewares)
              if(combinedMiddlewareArray && combinedMiddlewareArray.length > 0){
                await socketMiddlewareHandler(Promise, injectedIo, socket, msg, cb, combinedMiddlewareArray)
              }
              // if(_socketRoutersObject[key].middleWareArr && _socketRoutersObject[key].middleWareArr.length > 0){
              //   await socketMiddlewareHandler(Promise, injectedIo, socket, msg, cb, _socketRoutersObject[key].middleWareArr)
              // }
              if(chosenEvent.middleWareArr && chosenEvent.middleWareArr.length > 0){
                await socketMiddlewareHandler(Promise, injectedIo, socket, msg, cb, chosenEvent.middleWareArr)
              }
              await chosenEvent.handler(injectedIo, socket, msg, cb, _injected)
            }catch(e){
              console.log(e)
            }
          })
        }
    
        // socket.on()
      }

      socket.on('disconnect', ()=>{
        console.log(socket.id, 'disconnected ')
      })

    })
    _Instance.events.emit('log')
    return injectedIo
}

export default socketHandler
