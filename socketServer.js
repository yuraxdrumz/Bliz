import Bliz, { struct, superstruct } from './src/main'
import path from 'path'
import io from 'socket.io'

const app = Bliz()

// should contain all added events


const listener2 = app
.createSocketListener('team1')
.handler((io, socket, msg, cb)=>{
  console.log('awsome')
})
.middleware((io, socket, msg, cb, next)=>{
  console.log('middleware!')
  // next()
}, 5000)
.middleware((io, socket, msg, cb, next)=>{
  console.log('middleware2!')
  // next()
}, 5000)

const listener3 = app
.createSocketListener('team2')
.handler((io, socket, msg, cb)=>cb('awsomeee'))

const socketRouter = app
.createSocketRouter('teams')
.event(listener2)
.event(listener3)

const otherRouter = app
.createSocketRouter('prefix')
.socketSubRouter(socketRouter)
.event(listener2)
.event(listener3)

// .event(listener2).event(listener3)

app
  .sockets({enabled: true, io: io, delimiter: ':'})
  .registerSocketRouters(otherRouter)
  .prettyPrintSocket()
  .listen(4000,()=>console.log('listening on bliz server on port 4000'))