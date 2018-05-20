import Bliz, { struct, superstruct } from './src/main'
import path from 'path'
import io from 'socket.io'

const app = Bliz()

// should contain all added events
// TODO: change all names of createSocketRouter => createRouter like http
// TODO: change all names of socketSubRouter => subRouter like http
// TODO: change name of registerSocketRouters => registerRouters like http
// TODO: add check if type is http do this, if type is sockets do that
// TODO: add middlewares regular, add

const listener2 = app
.createSocketListener('team1')
.handler((io, socket, msg, cb, { mongoose })=>{
  mongoose()
  console.log('awsome')
})
.middleware((io, socket, msg, cb, next)=>{
  console.log('middleware!')
  next()
}, 5000)
.middleware((io, socket, msg, cb, next)=>{
  console.log('middleware2!')
  next()
}, 5000)
// .errHandler((io, socket, msg, e)=>{
//   console.log(e)
// })

const listener3 = app
.createSocketListener('team2')
.handler((io, socket, msg, cb)=>cb('awsomeee'))

const socketRouter = app
.createSocketRouter('teams')
.event(listener2)
.event(listener3)
.middleware((io, socket, msg, cb, next)=>{
  console.log('teams router middleware')
  next()
}, 5000)
// .errHandler((io, socket, msg, e)=>{
//   console.log(e)
// })

const otherRouter = app
.createSocketRouter('prefix')
.socketSubRouter(socketRouter)
.event(listener2)
.event(listener3)
.middleware((io, socket, msg, cb, next)=>{
  console.log('prefix router middleware')
  next()
}, 5000)

// .event(listener2).event(listener3)

app
  .sockets({enabled: true, io: io, delimiter: ':'})
  .registerSocketRouters(otherRouter)
  .registerSocketRouters(socketRouter)
  .prettyPrint()
  .inject({
    mongoose:()=>{console.log('mongoose called')}
  })
  .middleware((req,res, next)=>{
    console.log('request')
  })
  .socketMiddleware((io, socket, msg, cb, next) => {
    console.log('global')
    next()
  }, 5000)
    .listen(4000)
