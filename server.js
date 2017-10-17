import bliz from './src/main'
const app = bliz()

const getData = app
  .createPath('/:ss/bin/:param2')
  .handler((req,res)=>res.json({params:req.params,query:req.query}))

const slashRouter = app
  .createRouter('/')
  .get(getData)

app.registerRouters(slashRouter).listen(3000,()=>console.log('listening on bliz server on port 3000'))

