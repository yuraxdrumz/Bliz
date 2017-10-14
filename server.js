import bliz from './src/main'
const exp = bliz()
const expSub = bliz()

const getData = exp
  .createPath('/getData')
  .handler((req,res)=>{res.write('data insside news');res.end()})
  .middleware((req,res,next)=>{console.log('data middleware');next()})

const getNews = exp
  .createPath('/dasads')
  .middleware((req,res,next)=>{console.log('news array');next()})
  .handler((req,res)=>{throw  22222;res.end()})

const dataRouter = exp
  .createRouter('/data')
  .get(getData)
  .middleware((req,res,next)=>{console.log('data router...');next()})

const newsRouter = exp
  .createRouter('/bla/dd')
  .subRouter(dataRouter)
  .get(getNews)
  .middleware((req,res,next)=>{console.log('news router...');next()})

const blaRouter = exp
  .createRouter('/thirdNested')
  .subRouter(dataRouter)
  .get(getNews)
  .middleware((req,res,next)=>{console.log('news router...');next()})



const subAppData = expSub
  .createPath('/data')
  .handler((req,res)=>{res.write('sdddasdas');res.end()})
  .middleware((req,res,next)=>{console.log('sub app router...');next()})

const getOtherData = expSub
  .createRouter('/lk')
  .get(subAppData)
  .middleware((req,res,next)=>{console.log('other middleware...');next()})
const anotherSubApp = bliz()
const another3SubApp = bliz()
const otherBranchSubApp = bliz()
anotherSubApp
  .subApp(another3SubApp)
  .registerRouters(blaRouter)
another3SubApp
  .registerRouters(blaRouter)

expSub
  .registerRouters(getOtherData)
  .subApp(anotherSubApp)
  .middleware((req,res,next)=>{console.log('sub router...');next()})

otherBranchSubApp.registerRouters(getOtherData)


exp

  // .middleware(function(req,res,next){console.log('global router middleware');next()})
  .registerRouters(newsRouter)
  .listen(3000,()=>{
    console.log('listening on bliz server on port 3000')
  })





