import exp from './src/main'


const apiRouter = exp.createRouter('/api')
const authRouter = exp.createRouter('/auth')
const ds = exp.createRouter('/ds')

const errHandlerForAPi = function(req,res,e1,e2){
  res.writeHead(404)
  res.write(e1.toString())
  res.write(e2.toString())
  res.end()
}

const getLogin = exp.createPath('/login')
const getLogin2 = exp.createPath('/login2')

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
  .middleware((req,res,next)=>{console.log('sadsa');next()})
  .middleware((req,res,next)=>{console.log('middsdadsaleware2');next()})
  .handler((req,res)=>{
    res.json('blaa')
  })
  .errHandler((req,res,err)=>{
    console.log('err from login2')
    res.end()
  })

apiRouter
  .get(getLogin2)
  .get(getLogin)
  .post(getLogin2)
  .put(getLogin2)
  .del(getLogin2)
  .routerErrorHandler(errHandlerForAPi)
  .middleware(function(req,res,next){console.log('api router middleware');next()})

authRouter
  .routerErrorHandler(errHandlerForAPi)
  .middleware(function(req,res,next){console.log('auth router middleware');next()})

exp
  .middleware((req,res,next)=>{console.log(`global middleware`);next()})
  .registerRouters(apiRouter, authRouter, ds)
  .listen(3000, ()=>console.log(`listening on port 3000`))


