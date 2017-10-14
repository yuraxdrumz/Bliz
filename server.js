import bliz from './src/main'
const exp = bliz()
const expSub = bliz()

const getData = exp
  .createPath('/getData')
  .handler((req,res)=>{res.write('data insside news');res.end()})
  .middleware((req,res,next)=>{console.log('data middleware');next()})

const getNews = exp
  .createPath('/getNews')
  .middleware((req,res,next)=>{console.log('news array');next()})
  .handler((req,res)=>{throw  22222;res.end()})

const dataRouter = exp
  .createRouter('/data')
  .get(getData)
  .middleware((req,res,next)=>{console.log('data router...');next()})

const newsRouter = exp
  .createRouter('/')
  .subRouter(dataRouter)
  .get(getNews)
  .middleware((req,res,next)=>{console.log('news router...');next()})


exp
  .middleware(function(req,res,next){console.log('global router middleware');next()})
  .registerRouters(newsRouter)
  .listen(3000,()=>{
  console.log('listening on bliz server on port 3000')
})


const subAppData = expSub
  .createPath('/data')
  .handler((req,res)=>{res.write('sdddasdas');res.end()})

const getOtherData = expSub
  .createRouter('/other')
  .get(subAppData)

expSub.registerRouters(getOtherData)

console.log(exp.getObjProps())
console.log(expSub.getObjProps())





