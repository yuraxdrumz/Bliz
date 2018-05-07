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
  responses: 'array?'
})

const methodStruct = methodName => struct({
  [methodName]: singlePathMetaData
})

const pathStruct = (pathName, methodName) => struct({
  [pathName]: methodStruct(methodName)
})


const pathDescribe = ({path, method, tags, description, requests, requestBody, responses}) => {
  const injectedPathWithParams = pathStruct(path, method)
  const jsonWithParams = {
    [path]:{
      [method]:{
        tags,
        description,
        parameters: requests,
        requestBody,
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
console.log(yamlText)

const pathText = stringify(pathDescribe({
  path: '/api/bla',
  method:'get',
  description:'saddsa',
  tags:['saddas','sdadsa'],
  requests: [{in: 'query'}, {in:'params'}],
  // responses: [{status:200, schema: responseSchema}, {status:400, schema: errorSchema}]
}))

console.log(pathText)