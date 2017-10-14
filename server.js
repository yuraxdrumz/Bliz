import bliz from './src/main'
const exp = bliz()


const getData = exp
  .createPath('/getData')
  .handler((req,res)=>{res.write('data insside news');res.end()})
  .middleware((req,res,next)=>{console.log('data middleware');next()})

const getNews = exp
  .createPath('/getNews')
  .middleware((req,res,next)=>{console.log('news array');next()})
  .handler((req,res)=>{throw  22222;res.end()})
  .errHandler((req,res,e)=>{res.write(`get news  err handler: `+e.toString());res.end()})

const dataRouter = exp
  .createRouter('/data')
  .get(getData)
  .middleware((req,res,next)=>{console.log('data router...');next()})

const newsRouter = exp
  .createRouter('/news')
  .subRouter(dataRouter)
  .get(getNews)
  .middleware((req,res,next)=>{console.log('news router...');next()})
  .routerErrorHandler((req,res,e)=>{res.write(`router err handler: `+e.toString());res.end()})


exp
  .registerRouters(newsRouter)
  .registerRouters(dataRouter)
  .listen(3000,()=>{
  console.log('listening on bliz server on port 3000')
})




