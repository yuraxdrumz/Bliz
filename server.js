import bliz from './src/main'
const exp = bliz()

const getData = exp
  .createPath('/')
  .handler((req,res)=>{
    res.setHeader('Connection', 'close');
    res.end('Hello World!');
    })

const apiRouter = exp
  .createRouter('/api')
  .get(getData)
.middleware((req,res,next)=>{console.log('data middleware');next()})

exp
  .registerRouters(apiRouter)
  .listen(3000,()=>{
    console.log('listening on bliz server on port 3000')
  })


