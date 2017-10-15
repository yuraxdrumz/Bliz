import bliz from './src/main'
const exp = bliz()

const getData = exp
  .createPath('/:firstParam/data/:otherParam')
  .handler((req,res)=>{
    console.log(req.params)
    res.setHeader('Connection', 'close');
    res.end('Hello World!');
    })

const getDat2a = exp
  .createPath('/')
  .handler((req,res)=>{
    console.log(req.params)
    res.setHeader('Connection', 'close');
    res.end('Hello World!');
  })

const simple = exp
  .createRouter('/ddd')
  .get(getData)
  .get(getDat2a)
  .middleware((req,res,next)=>{console.log('/ middleware');next()})


exp
  .registerRouters(simple)
  .listen(3000,()=>{
    console.log('listening on bliz server on port 3000')
  })


