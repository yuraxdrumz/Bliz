import exp from './src/main'

const apiRouter = exp.createRouter('/api')
const authRouter = exp.createRouter('/auth')
const apiInnerRouter = exp.createRouter('/ds')
const apiInner2Router = exp.createRouter('/inner2')

const errHandlerForAPi = function(req,res,e1,e2){
  res.writeHead(404)
  res.write(e1.toString())
  res.write(e2.toString())
  res.end()
}

const getLogin = exp.createPath('/login')
const getLogin2 = exp.createPath('/login2')

apiInner2Router
  .get(getLogin)
  .middleware((req,res,next)=>{console.log('api inner inner router middleware');next()})

apiInnerRouter
  .subRouter(apiInner2Router)
  .middleware((req,res,next)=>{console.log('api inner router middleware');next()})

getLogin
  .middleware((req,res,next)=>{console.log('middleware1');next()})
  .middleware((req,res,next)=>{console.log('middleware2');next()})
  .handler((req,res)=>{
    res.writeHead(200)
    res.write('this is from loginnn')
    res.end()
  })
  .errHandler((req,res,err)=>{
    console.log('err from login')
    res.end()
  })

getLogin2
  .handler((req,res)=>{
  res.write('dsaasdads')
    res.end()
    // res.json({ds:'sss'})
  })
  .errHandler((req,res,err)=>{
  console.log(err)
    console.log('err from login2')
    res.end()
  }).middleware(function(req,res,next){console.log('route router middleware');next()})

apiRouter
  .subRouter(apiInnerRouter)
  .get(getLogin2)
  .routerErrorHandler(errHandlerForAPi)
  .middleware(function(req,res,next){console.log('api router middleware');next()})

authRouter
  .routerErrorHandler(errHandlerForAPi)
  .middleware(function(req,res,next){console.log('auth router middleware');next()})

exp
  .middleware(function(req,res,next){console.log('global router middleware');next()})
  .registerRouters(apiRouter, authRouter)
  .listen(3000, ()=>console.log(`listening on port 3000`))

