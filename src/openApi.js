const { struct } = require('superstruct')
const { stringify } = require('json-to-pretty-yaml')

const contactStruct = struct({
  name: 'string?',
  email: 'string?',
  url: 'string?'
})

const licenseStruct = struct({
  name: 'string?',
  url: 'string?'
})

const serverStruct = struct({
  url: 'string?',
  description: 'string?'
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

// mainDescribe block
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
  [methodName === 'del' ? 'delete' : methodName]: singlePathMetaData
})

const pathStruct = (pathName, methodName) => struct({
  [pathName]: methodStruct(methodName)
})

// assign nested object properties
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

// recurse on structs and populate object according to struct received
const getNested = (struct, map = {}) => {
  const schema = (struct.schema && struct.schema.schema) || struct.schema
  const keys = Object.keys(schema)
  for(let key of keys){
    // console.log(key, schema[key])
    if(schema[key].kind && schema[key].kind === 'object'){
      const result = getNested(schema[key], {})
      assign(map, [key, 'type'], 'object')
      assign(map, [key, 'properties'], result)
      // assign(map, [key], result)
    } else if (schema[key].kind && schema[key].kind === 'list'){
      // console.log(`schema[key]`, schema[key].type)
      assign(map, [key, 'type'], 'array')
      let type = schema[key].type.replace(/\[|\]/g,'')
      assign(map, [key, 'items', 'type'], type.replace('?', ''))
    } else if(schema[key].kind && schema[key].kind === 'enum'){
      assign(map, [key, 'type'], 'string')
      assign(map, [key, 'enum'], schema[key].type.split('|').map(item=>item.replace(/\"/g, '').replace(/\s/g, '')))
    } else if(schema[key].kind && schema[key].kind === 'scalar'){
      assign(map, [key], schema[key].type)
    }else if(schema[key].kind && schema[key].kind === 'dict'){
      assign(map, [key, 'type'], 'object')
      const type = schema[key].type.replace(/dict\<|\>/g, '')
      assign(map, [key, 'type'], type.substring(type.indexOf(',') + 1))
    }else if(schema[key].kind && schema[key].kind === 'function'){
    
    }else if(schema[key].kind && schema[key].kind === 'instance'){
    
    }else if(schema[key].kind && schema[key].kind === 'interface'){
    
    }else if(schema[key].kind && schema[key].kind === 'intersection'){
      const types = schema[key].type.split('&').map(item=>item.replace(/\s/g, '')).map(item=> 'type: '+item)
      assign(map, [key, 'allOf'], types)
    }else if(schema[key].kind && schema[key].kind === 'literal'){
      // const types = schema[key].type.replace(/literal:|\s/g, '')
      // assign(map, [key, 'type'], types)
    }else if(schema[key].kind && schema[key].kind === 'lazy'){

    } else if(schema[key].kind && schema[key].kind === 'tuple'){

    }else if(schema[key].kind && schema[key].kind === 'union'){
      const types = schema[key].type.split('|').map(item=>item.replace(/\s/g, '')).map(item=> 'type: '+item)
      assign(map, [key, 'anyOf'], types)
    }else {
      // console.log(key, schema[key])
      // console.log(`assigning type array`, key, schema[key])
      assign(map, [key, 'type'], schema[key].replace('?', ''))
      if(schema[key] === 'array'){
        assign(map, [key, 'items', 'type'], 'object')
      }
    }
  }
  // console.log(`map:`, map)
  return map
}

// add request schema based on path, method and request object
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

// build response object
const responseBuilder = (responses, path, method) => {
  const responseObject = {}
  for(let resp of responses){
    responseObject[resp.status] = {
      description: `${resp.status}`,
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

// describe path based on data received
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
    const map = getNested(request, {})
    const keys = Object.keys(map)
    for(let key of keys){
      const obj = {}
      obj.name = key
      obj.in = request.in
      obj.required = !map[key]['type'].includes('?')
      obj.schema = {}
      obj.schema.type = map[key]['type'].replace('?', '')
      arrayToConcat.push(obj)
    }
    return arrayToConcat
  
  
    // console.log(objectToReturn)
  }).reduce((prev,curr)=>prev.concat(curr),[])

  const jsonWithParams = {
    [swaggerPath]:{
      [method === 'del' ? 'delete' : method]:{
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

// schema builder according to describe.requests object and describe.responses
const schemas = (schemas, securitySchemes) => {
  const schemasObject = {}
  for(let sc of schemas){
    const data = getNested(sc)
    schemasObject[sc.name] = data[Object.keys(data)[0]]
  }
  return {
    components:{
      securitySchemes,
      schemas:schemasObject
    }
  }
}


module.exports = {
  pathDescribe,
  schemas,
  mainDescribe
}