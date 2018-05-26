// socket handler, called from listen when use sockets is set to true
const socketHandler = ({
  _useSockets,
  _Instance,
  _injected,
  server,
  _version,
  args,
  os,
  print,
  socketMiddlewareHandler,
  checkSubRouters
}) => {
  const injectedIo = _useSockets.io(server)
  if (args.length > 1) {
    server.listen.apply(server, args)
  } else {
    server.listen.apply(server, [
      args[0],
      () =>
        print([
          `Listening on Bliz server ${_version} on port ${args[0]}`,
          `Platform: ${os.platform()}`,
          `Hostname: ${os.hostname()}`,
          `Architecture: ${os.arch()}`,
          `CPU Cores: ${os.cpus().length}`,
          `Memory Free: ${(
            os.freemem() /
            1024 /
            1024 /
            (os.totalmem() / 1024 / 1024) *
            100
          ).toFixed(0)}%, ${(os.freemem() / 1024 / 1024).toFixed(0)} MB / ${(
            os.totalmem() /
            1024 /
            1024
          ).toFixed(0)} MB`
        ])
    ])
  }

  // on connection add all routers and middlewares
  injectedIo.on('connection', (socket) => {
    const routersKeys = Object.keys(_useSockets._socketRoutersObject)
    for (let key of routersKeys) {
      const eventKeys = Object.keys(_useSockets._socketRoutersObject[key].event)
      for (let eventKey of eventKeys) {
        socket.on(`${key}${_useSockets.delimiter}${eventKey}`, async (msg, cb) => {
          try {
            const chosenEvent = _useSockets._socketRoutersObject[key].event[eventKey].getObjProps()
            if (_useSockets._socketMiddlewares && _useSockets._socketMiddlewares.length > 0) {
              await socketMiddlewareHandler(
                Promise,
                injectedIo,
                socket,
                msg,
                cb,
                _useSockets._socketMiddlewares
              )
            }
            let combinedMiddlewareArray = []
            key
              .split(_useSockets.delimiter)
              .map(
                (prefix) =>
                  _useSockets._socketRoutersObject[prefix]
                    ? checkSubRouters(
                        _useSockets._socketRoutersObject[prefix],
                        combinedMiddlewareArray
                      )
                    : void 0
              )

            combinedMiddlewareArray = combinedMiddlewareArray.reduce((prev, curr) =>
              prev.concat(curr)
            )
            if (combinedMiddlewareArray && combinedMiddlewareArray.length > 0) {
              await socketMiddlewareHandler(
                Promise,
                injectedIo,
                socket,
                msg,
                cb,
                combinedMiddlewareArray
              )
            }
            if (chosenEvent.middleWareArr && chosenEvent.middleWareArr.length > 0) {
              await socketMiddlewareHandler(
                Promise,
                injectedIo,
                socket,
                msg,
                cb,
                chosenEvent.middleWareArr
              )
            }
            await chosenEvent.handler(injectedIo, socket, msg, cb, _injected)
          } catch (e) {
            console.log(e)
          }
        })
      }
    }
    socket.on('disconnect', () => {})
  })
  _Instance.events.emit('log')
  return injectedIo
}

export default socketHandler
