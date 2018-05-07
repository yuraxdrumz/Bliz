const { struct } = require('superstruct')

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
      contact: {
        name,
        email,
        url
      },
      license: {
        name,
        url
      }
    },
    servers:[]
  }
}

const parameterStruct = struct({
  name: 'string',
  in: 'string',
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