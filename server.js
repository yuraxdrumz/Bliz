import Bliz, { request, response, struct, superstruct } from './src/main'
import bodyParser from 'body-parser'

const app = Bliz()

const validationSchema = struct({
  data:'string'
})

const bodySchema = struct({
  data:'number?'
})

const querySchema = struct({
  bla:'string'
})

const errorSchema = struct({
  error: 'string'
})

const responseSchema = struct({
  response: 'string'
})

const getData = app
  .createPath('/:data/')
  .handler((req,res)=>{
    res.json('dsasda')
  })
  .errHandler((req,res, e)=>{
    res.json({error:e.message})
  })
  .describe({
    requests:[{}]
  })
  .middleware((req,res,next)=>{
    console.log('hit getData1')
    next()
  })
const boom = app
  .createPath('/:data/boom')
  .handler((req,res)=>{
    res.json({params:req.params,query:req.query,body:req.body})
  })
  .middleware((req,res,next)=>{
    console.log('hit boom')
    next()
  })

const boom2 = app
  .createPath('/:bla/bb')
  .handler((req,res)=>res.json({params:req.params,query:req.query,body:req.body}))
  .describe({
    tags: ['main route', 'simple tag'],
    summary: 'simple summary for swagger',
    description: 'returns whatever it receives',
    requests: [{in: 'params', schema: bodySchema}],
    responses: [{status:200, schema: responseSchema}, {status:400, schema: errorSchema}]
  })
  .middleware((req,res,next)=>{
    console.log('yesasadds')
    next()
  })

const getData3 = app
  .createPath('/:data/:boom/wok')
  .handler((req,res)=>res.json({params:req.params,query:req.query,body:req.body}))
  .middleware((req,res,next)=>{
    // console.log('hit getData3')
    next()
  })




const slashRouter2 = app
  .createRouter('/lalala')
  .del(boom)
  .get(boom2)
  .post(boom)
  .get(getData)
  .get(getData3)
  .middleware((req,res,next)=>{
    console.log('hit /lalala')
    next()
  })
const slashRouter = app
  .createRouter('/api/')
  .subRouter(slashRouter2)
  .get(boom)
  .get(boom2)
  .post(boom)
  .put(getData)
  .get(getData3)
  .middleware((req,res,next)=>{
    console.log('hit /api')
    next()
  })
// app2.events.addListener('*',data=>console.log(`event delegated to app2: ${this.events}, data: ${data}`))
// app.events.addListener('*',data=>console.log(`event delegated to app: ${app.events.event}, data: ${data}`))

app
  .registerRouters(slashRouter)
  .prettyPrint()
  .inject({
    bla:()=>console.log('blaaaa'),
    otherFunc:()=>console.log('other func')
    // mongooseConnection
  })
  .describe({
    
  })
  .middleware(bodyParser.json())
  .listen(3000,()=>console.log('listening on bliz server on port 3000'))

