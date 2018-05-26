import Bliz from '../../src/main'
import prefixRouter from './prefix.router'
const app = Bliz()

app
  .sockets({useSockets: true, delimiter: ':'})
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
