import bliz from './src/main'
const app = bliz()

const getData = app
  .createPath('/data')
  .handler((req,res)=>res.json(req.params))

const slashRouter = app
  .createRouter('/')
  .get(getData)

app.registerRouters(slashRouter).listen(3000,()=>console.log('listening on bliz server on port 3000'))
