import bliz from './src/main'
const app = bliz()

const getData = app
  .createPath('/:ss')
  .handler((req,res)=>res.json({params:req.params,query:req.query}))

const slashRouter = app
  .createRouter('/ab/b')
  .get(getData)

app.registerRouters(slashRouter).listen(3000,()=>console.log('listening on bliz server on port 3000'))
