import Bliz, { request, response, struct, superstruct } from './src/main'
import bodyParser from 'body-parser'
import path from 'path'
import io from 'socket.io'

const app = Bliz()


const server = app
  .prettyPrint()
  .sockets({enabled: true, io})
  .listen(3000,()=>console.log('listening on bliz server on port 3000'))


// should contain all added events

const listener2 = app.createSocketListener('team1').handler((cb)=>cb('awsome'))
const listener3 = app.createSocketListener('team2').handler((cb)=>cb('awsomeee'))

const listener1 = app.createSocketRouter('teams').event(listener2).event(listener3)

// .event(listener2).event(listener3)
