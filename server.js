import Bliz, { request, response, struct, superstruct } from './src/main'
import bodyParser from 'body-parser'
import path from 'path'

const app = Bliz()

const paramSchema = struct({
  param: 'string'
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
  requests: [{in: 'body', schema: paramSchema}, {in:'path', schema: statusSchema}],
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
    version:'1.0.1', 
    description:'some random api', 
    contact:{name:'me', email:'yuri.khomyakov@ironsrc.com', url:'asddsasad'},
    license:{
      name: 'MIT',
      url:'dsadsa'
    },
    servers:[{url:'sadadsadads', description:'asdadsdssdaasd'}]
  })
  .swagger({
    absoluteFilePath: path.resolve('./swagger.yaml')
  })
  .middleware(bodyParser.json())
  .listen(3000,()=>console.log('listening on bliz server on port 3000'))

