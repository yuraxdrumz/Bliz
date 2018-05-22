import Bliz from '../src/main'
import io from 'socket.io'
import prefixRouter from './prefix.router'
const app = Bliz()

app
  .sockets({enabled: true, io: io, delimiter: ':'})
  .registerSocketRouters(prefixRouter(app))
  .prettyPrint()
  .inject({
    mongoose:()=>{console.log('mongoose called')}
  })
  .socketMiddleware((io, socket, msg, cb, next) => {
    console.log('global')
    next()
  })
  .listen(4000)