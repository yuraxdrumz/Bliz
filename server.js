import Bliz, { request, response, struct, superstruct } from './src/main'
import bodyParser from 'body-parser'

const app = Bliz()

const paramSchema = struct({
  param: 'string'
})

const responseSchema = struct({
  data: 'array'
})

const errorSchema = struct({
  error: 'string'
})

const route = app
.createPath('/test/:param')
.handler((req,res)=>res.json('addas'))
.describe({
  tags: ['main route', 'simple tag'],
  summary: 'simple summary for swagger',
  description: 'returns whatever it receives',
  requests: [{in: 'path', schema: paramSchema}],
  responses: [{status:200, schema: responseSchema}, {status:400, schema: errorSchema}]
})

const route2 = app
.createPath('/:status/')
.handler((req,res)=>res.json('addas'))
.describe({
  tags: ['oven', 'jenkins'],
  summary: 'simple summary for swagger',
  description: 'returns whatever it receives',
  requests: [{in: 'body', schema: paramSchema}, {in:'params', schema: paramSchema}],
  responses: [{status:200, schema: responseSchema}, {status:400, schema: errorSchema}]
})

const slashRouter = app
  .createRouter('/api/')
  .get(route)
  .post(route2)
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
    title:'my api', 
    version:'1.0.0', 
    description:'some random api', 
    contact:{name:'me', email:'yuri.khomyakov@ironsrc.com', url:'asddsasad'},
    license:{
      name: 'dasdsaa',
      url:'dsadsa'
    },
    servers:[{url:'sadadsadads', description:'asdadsdssdaasd'}]
  })
  .swagger({
    createYAML: true
  })
  .middleware(bodyParser.json())
  .listen(3000,()=>console.log('listening on bliz server on port 3000'))

