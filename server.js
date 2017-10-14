import bliz from './src/main'
const exp = bliz()

const getData = exp
  .createPath('/')
  .handler((req,res)=>{res.write('data insside news');res.end()})
  .middleware((req,res,next)=>{console.log('data middleware');next()})

const apiRouter = exp
  .createRouter('/')
  .get(getData)

exp
  .registerRouters(apiRouter)
  .listen(3000,()=>{
    console.log('listening on bliz server on port 3000')
  })



