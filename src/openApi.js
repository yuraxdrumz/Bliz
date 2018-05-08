const { struct } = require('superstruct')
const { stringify } = require('json-to-pretty-yaml')

const contactStruct = struct({
  name: 'string',
  email: 'string',
  url: 'string'
})

const licenseStruct = struct({
  name: 'string',
  url: 'string'
})

const serverStruct = struct({
  url: 'string',
  description: 'string'
})

const infoStruct = struct({
  title: 'string?',
  version: 'string?',
  description: 'string?',
  termsOfService: 'string?',
  contact: contactStruct,
  license: licenseStruct,
})

const mainDescribeStruct = struct({
  openapi: 'string',
  security: 'array?',
  info: infoStruct,
  servers: [serverStruct]
})

const mainDescribe = ({title, version, description, termsOfService, contact, license, servers, security}) => {
  const validJson = {
    openapi: "3.0.0",
    security,
    info: {
      title,
      version,
      description,
      termsOfService,
      contact,
      license
    },
    servers
  }
  return mainDescribeStruct(validJson)
}



const parameterStruct = struct({
  name: 'string',
  in: struct.enum(['query', 'path']),
  description: 'string?',
  required: 'boolean?',
})

const singlePathMetaData = struct({
  tags: ['string'],
  description: 'string',
  parameters: 'array?',
  requestBody: 'object?',
  summary: 'string',
  responses: 'array?'
})

const methodStruct = methodName => struct({
  [methodName]: singlePathMetaData
})

const pathStruct = (pathName, methodName) => struct({
  [pathName]: methodStruct(methodName)
})


const getNested = (struct, cycle = 1, map = {}) => {
  const schema = cycle === 1 ? struct.schema.schema : struct.schema
  const keys = Object.keys(schema)
  // console.log(`keys: `, struct)
  for(let key of keys){
    if(schema[key].schema && typeof schema[key].schema === 'object'){
      return getNested(schema[key], ++cycle, map)
    } else {
      map[key] = schema[key]
    }
    // console.log(typeof schema[key].schema)
  }
  // for(key of keys){
    
  //   console.log(key)
  //   if(struct.schema[key] === 'object'){
  //     getNested(struct.schema, map)
  //   }else{
  //     map.set(key, struct.schema.schema[key])
  //   }
  // }
  return map
}

const addRequest = (request) => {
  if(!request) return
  return {
    content:{
      'application/json':{
        schema:{
          $ref:"#/components/schemas/error"
        }
      }
    }
  }
}

const pathDescribe = ({path, method, tags, description, summary, requests, requestBody, responses}) => {
  // console.log(Object.keys(requests[0].schema.schema))
  const myRegexp = /(:.+?)([\/]|$)/g
  const swaggerPath = path.replace(myRegexp, function(...args){
    return args[0].replace(args[1], `{${args[1].replace(':', '')}}`)
  })
  const bodyRequests = requests.filter(request=>request.in === 'body')
  const parametersRequests = requests.filter(request=>['path', 'query'].includes(request.in))
  const injectedPathWithParams = pathStruct(swaggerPath, method)

  const parametersToInject = parametersRequests.map(request=>{
    // const all 
    const arrayToConcat = []
    const map = getNested(request,1, {})
    const keys = Object.keys(map)
    for(let key of keys){
      const obj = {}
      obj.in = request.in
      obj.name = key
      obj.required = !map[key].includes('?')
      obj.type = map[key].replace('?', '')
      arrayToConcat.push(obj)
    }
    return arrayToConcat
  
  
    // console.log(objectToReturn)
  }).reduce((prev,curr)=>prev.concat(curr),[])

  const jsonWithParams = {
    [swaggerPath]:{
      [method]:{
        tags,
        description,
        summary,
        requestBody: addRequest(bodyRequests[0]),
        parameters: parametersToInject.length > 0 ? parametersToInject : undefined,
        responses
      }
    }
  }
  return injectedPathWithParams(jsonWithParams)
}

const schemas = () => {}


const yamlText = stringify(mainDescribe({
  title:'my api', 
  version:'1.0.0', 
  description:'some random api', 
  contact:{name:'me', email:'yuri.khomyakov@ironsrc.com', url:'asddsasad'},
  license:{
    name: 'dasdsaa',
    url:'dsadsa'
  },
  servers:[{url:'sadadsadads', description:'asdadsdssdaasd'}]
}))
// console.log(yamlText,pathText)
// console.log(yamlText)

const querySchema = struct({
  data:'number?',
  bla: 'number'
})

const pathText = stringify(pathDescribe({
  path: '/api/:bla/boom/getData/:param',
  method:'get',
  tags: ['main route', 'simple tag'],
  summary: 'simple summary for swagger',
  description: 'returns whatever it receives',
  requests: [{in: 'query', schema: querySchema}, {in:'path', schema: querySchema}],
  // responses: [{status:200, schema: responseSchema}, {status:400, schema: errorSchema}]
}))

const pathText2 = stringify(pathDescribe({
  path: '/api/new-house/:house',
  method:'post',
  tags: ['main route', 'simple tag'],
  summary: 'simple summary for swagger',
  description: 'returns whatever it receives',
  requests: [{in: 'body', schema: querySchema}],
  // responses: [{status:200, schema: responseSchema}, {status:400, schema: errorSchema}]
}))


console.log(pathText2)