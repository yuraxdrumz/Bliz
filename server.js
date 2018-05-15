import Bliz, { request, response, struct, superstruct } from './src/main'
import bodyParser from 'body-parser'
import path from 'path'
import io from 'socket.io'

const app = Bliz()

const paramSchema = struct({
  param: 'string?'
})
const statusSchema = struct({
  status: 'string'
})

class MyObject{}

const structush = struct({
  name: 'string',
  field1:'number',
  field2: paramSchema,
  array:struct.enum([1, 'other', 'last']),
  any: struct.any(['boolean']),
  dict:struct.dict(['string', 'object']),
  fn:struct.function(()=>typeof value === 'string'),
  instance:struct.instance(MyObject),
  interface:struct.interface({
    property: 'number',
    method: 'function',
  }),
  // tuple: struct.union(['boolean', 'string']),
  // intersection:struct.intersection(['string', 'number']),
  list:struct.list(['string']),
  literal:struct.literal(42),
  left: struct.lazy(() => struct.optional('string')),
  // object:struct.object({
  //   id: 'number',
  //   name: 'string',
  // }),
  // partial:struct.partial({
  //   a: 'number',
  //   b: 'number',
  // })
})

const otherSchema = struct({
  inner: structush,
  lala:'number'
  // structArray: structush
})

const responseSchema = struct({
  data: otherSchema
})

const querySchema = struct({
  ggg: 'string'
})


const errorSchema = struct({
  error: 'string'
})

const route = app
.createPath('/test/:param')
.handler((req,res)=>res.json({params:req.params, query:req.query, files:req.files}))
.describe({
  tags: ['main route', 'simple tag'],
  summary: 'simple summary for swagger',
  description: 'returns whatever it receives',
  incoming: [{in: 'path', schema: paramSchema}, {in: 'query', schema: querySchema}],
  outgoing: [{status:200, schema: responseSchema}, {status:400, schema: errorSchema}]
})
.middleware((req,res,next)=>{
  console.log('works like a charm!')
  next()
})

const route2 = app
.createPath('/:status/')
.handler((req,res)=>res.json({params:req.params, query:req.query}))
.describe({
  tags: ['oven', 'jenkins'],
  summary: 'simple summary for swagger',
  description: 'returns whatever it receives',
  incoming: [{in: 'body', schema: paramSchema}, {in:'path', schema: statusSchema}],
  outgoing: [{status:200, schema: responseSchema}, {status:400, schema: errorSchema}]
})

const slashRouter = app
  .createRouter('/api/')
  .post(route)
  .post(route2)
  .middleware((req,res,next)=>{
    console.log('hit /api')
    next()
  })
// app2.events.addListener('*',data=>console.log(`event delegated to app2: ${this.events}, data: ${data}`))
// app.events.addListener('*',data=>console.log(`event delegated to app: ${app.events.event}, data: ${data}`))

const socketServer = app
  .registerRouters(slashRouter)
  .prettyPrint()
  .inject({})
  .describe({
    title:'my api', 
    version:'1.0.1', 
    description:'some random api', 
    contact:{name:'me', email:'yuri.khomyakov@ironsrc.com', url:'asddsasad'},
    license:{
      name: 'MIT',
      url:'dsadsa'
    },
    servers:[{url:'sadadsadads', description:'asdadsdssdaasd'}]
  })
  .swagger({absoluteFilePath: path.resolve('./swagger.yaml')})
  .middleware(bodyParser.json())
  .sockets({enabled:true, io:io})
  .listen(3000,()=>console.log('listening on bliz server on port 3000'))
