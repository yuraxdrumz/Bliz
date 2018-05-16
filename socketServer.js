import Bliz, { request, response, struct, superstruct } from './src/main'
import path from 'path'
import io from 'socket.io'

const app = Bliz()

// should contain all added events


const listener2 = app
.createSocketListener('team1')
.handler((socket, msg, cb)=>cb('awsome'))

const listener3 = app
.createSocketListener('team2')
.handler((socket, msg, cb)=>cb('awsomeee'))

const socketRouter = app
.createSocketRouter('teams')
.event(listener2)
.event(listener3)

const otherRouter = app
.createSocketRouter('prefix')
.subSocketRouter(socketRouter)
.event(listener2)

// .event(listener2).event(listener3)

const server = app
  .prettyPrint()
  .sockets({enabled: true, io: io, delimiter: ':'})
  .registerSocketRouters(otherRouter)
  .listen(3000,()=>console.log('listening on bliz server on port 3000'))