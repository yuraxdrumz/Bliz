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


const pathDescribe = ({path, method, tags, description, parameters, requestBody, responses}) => {
  const injectedPathWithParams = pathStruct(path, method)
  const jsonWithParams = {
    [path]:{
      [method]:{
        tags,
        description,
        parameters,
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
  servers:[]
} ))
const pathText = stringify(pathDescribe({
  path:'/asdadsdasas/{api-name}',
  method:'get',
  tags:['one', 'two'],
  description: 'wahahahahaah',
  responses:[{status:'200', description:'sdadsaaasd', content:{'application/json':{schema: {name:'string', dsad:'array'}}}}],
  parameters:[{name:'data',
    in:'dsadsa'
    }, 
    {
    name:'api-name',
    in:'path'
  }]
}))

const postPathText = stringify(pathDescribe({
  path:'/dasadsads',
  method:'post',
  tags:['one', 'two'],
  description: 'wahahahahaah',
  requestBody:{
    content:{
      'application/json':{
        schema: {}
      }
    }

  }
}))
// console.log(yamlText,pathText)
console.log(pathText)