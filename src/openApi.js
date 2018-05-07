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


const mainDescribe = ({title, version, description, termsOfService, contact, license, servers, security}) => {
  return {
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
}

const parameterStruct = struct({
  name: 'string',
  in: struct.enum(['query', 'path']),
  description: 'string?',
  required: 'boolean?'
})

const pathStruct = struct({
  path: 'string'
})



const pathDescribe = ({path, method, tags, description, parameters, requestBody, responses}) => {
  return {
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
}

const schemas = () => {}


// const yamlText = stringify(mainDescribe({title:'my api', version:'1.0.0', description:'some andom api', contact:{name:'me', email:'yuri.khomyakov@ironsrc.com'}} ))
const pathText = stringify(pathDescribe({
  path:'/blabla',
  method:'get',
  tags:['one', 'two'],
  description: 'wahahahahaah',
  parameters:[{name:'data',
    in:'query'
    }, 
    {
    name:' dssdasad',
    in:'path'
  }]
  
  
}))
console.log(pathText)