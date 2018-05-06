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

const serversStruct = struct({
  url: ['string']
})


const mainDescribe = ({title, version, description, termsOfService, contact, license, servers}) => {
  return {
    openapi: "3.0.0",
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

const pathDescribe = ({path, method, description}) => {
  return {
    [path]:{
      [method]:{
        description,
      }
    }
  }
}

const schemas = () => {}