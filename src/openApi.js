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
  responses: 'object?'
})

const methodStruct = methodName => struct({
  [methodName]: singlePathMetaData
})

const pathStruct = (pathName, methodName) => struct({
  [pathName]: methodStruct(methodName)
})

const assign = (obj, keyPath, value) => {
  lastKeyIndex = keyPath.length-1;
  for (let i = 0; i < lastKeyIndex; ++ i) {
    key = keyPath[i];
    if (!(key in obj))
      obj[key] = {}
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
}

const getNested = (struct, map = {}) => {
  const schema = (struct.schema && struct.schema.schema) || struct.schema
  const keys = Object.keys(schema)
  for(let key of keys){
    console.log(key, schema[key])
    if(schema[key].kind && schema[key].kind === 'object'){
      const result = getNested(schema[key], {})
      assign(map, [key, 'type'], 'object')
      assign(map, [key, 'properties'], result)
      // assign(map, [key], result)
    } else if(schema[key].kind && schema[key].kind === 'enum'){
      assign(map, [key, 'type'], 'string')
      assign(map, [key, 'enum'], schema[key].type.split('|').map(item=>item.replace(/\"/g, '').replace(/\s/g, '')))
    } else {
      console.log(key, schema[key])
      assign(map, [key], schema[key])
    }
  }
  console.log(map)
  return map
}

const addRequest = (request, path, method) => {
  // console.log(`REQUEST: `, request)
  if(!request) return
  return {
    content:{
      [request.contentType || 'application/json']:{
        schema:{
          $ref:`#/components/schemas/${path.replace(/\//g, '').replace(/-/,'').replace(/[{|}]/g,'')}-body-${method}`
        }
      }
    }
  }
}

const responseBuilder = (responses, path, method) => {
  const responseObject = {}
  for(let resp of responses){
    responseObject[resp.status] = {
      content:{
        [resp.contentType || 'application/json']:{
          schema: {
            $ref: `#/components/schemas/${path.replace(/\//g, '').replace(/-/,'').replace(/[{|}]/g,'')}-${resp.status}-${method}`
          }
        }
      }
    }
  }
  return responseObject
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
    // TODO: change to nested structure
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
        requestBody: addRequest(bodyRequests[0], swaggerPath, method),
        parameters: parametersToInject.length > 0 ? parametersToInject : undefined,
        responses: responseBuilder(responses, swaggerPath, method)
      }
    }
  }
  return injectedPathWithParams(jsonWithParams)
}

const schemas = (schemas, securitySchemes) => {
  const schemasObject = {}
  for(let sc of schemas){
    // console.log(sc)
    // const obj = Object.assign({}, sc)
    // obj.schema = Object.assign({}, obj.schema)
    // obj.schema.schema = Object.assign({}, obj.schema.schema)
    // const keys = Object.keys(obj.schema.schema)
    // for(let key of keys){
    //   let replaced = false
    //   // console.log(obj.schema.schema)
    //   console.log(JSON.stringify(getNested(obj)))
    //   // TODO: change to nested structures
    //   if(obj.schema.schema[key].includes('?')){
    //     obj.schema.schema[key] = obj.schema.schema[key].replace('?', '')
    //     replaced = true
    //   }
    //   obj.schema.schema[key] = {
    //     type: obj.schema.schema[key],
    //     required: !replaced
    //   }
    // }
    // schemasObject[sc.name] = obj.schema.schema
    schemasObject[sc.name] = getNested(sc)
  }
  return {
    components:{
      securitySchemes,
      schemas: schemasObject
    }
  }
}


// const yamlText = stringify(mainDescribe({
//   title:'my api', 
//   version:'1.0.0', 
//   description:'some random api', 
//   contact:{name:'me', email:'yuri.khomyakov@ironsrc.com', url:'asddsasad'},
//   license:{
//     name: 'dasdsaa',
//     url:'dsadsa'
//   },
//   servers:[{url:'sadadsadads', description:'asdadsdssdaasd'}]
// }))
// console.log(yamlText,pathText)
// console.log(yamlText)

const querySchema = struct({
  data:'number?',
  bla: 'number'
})

// const pathText = stringify(pathDescribe({
//   path: '/api/:bla/boom/getData/:param',
//   method:'get',
//   tags: ['main route', 'simple tag'],
//   summary: 'simple summary for swagger',
//   description: 'returns whatever it receives',
//   requests: [{in: 'query', schema: querySchema}, {in:'path', schema: querySchema}],
//   // responses: [{status:200, schema: responseSchema}, {status:400, schema: errorSchema}]
// }))

const responseSchema = struct({
  data: 'array',
  porque: 'string'
})

const errorSchema = struct({
  error: 'string'
})


// const pathText2 = stringify(pathDescribe({
//   path: '/api/new-house/:house',
//   method:'post',
//   tags: ['main route', 'simple tag'],
//   summary: 'simple summary for swagger',
//   description: 'returns whatever it receives',
//   requests: [{in: 'body', contentType:'application/json', schema: querySchema}],
//   responses: [{status:200, schema: responseSchema}, {status:400, schema: errorSchema}]
// }))

// const swaggerSchemas = stringify(schemas([{name:'apinewhousehouse-body-post', schema:querySchema},{name:'fff', schema:errorSchema}, {name:'sdaasdsad', schema: responseSchema}]))

// console.log(pathText2)
// console.log(swaggerSchemas)

module.exports = {
  pathDescribe,
  schemas,
  mainDescribe
}