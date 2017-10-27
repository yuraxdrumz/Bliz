const starter = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger",
    "termsOfService": "http://swagger.io/terms/",
    "contact": {
      "email": "apiteam@swagger.io"
    },
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    }
  },
  "host": "petstore.swagger.io",
  "basePath": "/",
  "tags": [
    {
      "name": "pet",
      "description": "Everything about your Pets",
    },
    {
      "name": "store",
      "description": "Access to Petstore orders"
    },
    {
      "name": "user",
      "description": "Operations about user",
    }
  ],
  "schemes": [
    "http"
  ],
}


function getSwaggerDataFromApp(app){
  let finalUrls = []
  // console.log(app.getObjProps()._routersObject)
  const RouterPathsKeys = Object.keys(app.getObjProps()._routersObject)
  RouterPathsKeys.forEach(key=>{
    const methodKeys = ['get','post','put','del'].forEach(method=>{
      const urls = Object.keys(app.getObjProps()._routersObject[key][method])
      urls.forEach(url=>{
        const routeData = app.getObjProps()._routersObject[key][method][url].getObjProps()
        let fullPath = {
          url:key+url,
          method,
          response:routeData.response,
          tags:routeData.tags,
          responseStatus:routeData.responseStatus,
          errResponse:routeData.errResponse,
          errResponseStatus:routeData.errResponseStatus,
          validationSchemas:routeData.validationSchemas
        }
        finalUrls.push(fullPath)
        // console.log(`KEY:${key}, METHOD:${method}, URL:${url}`)
      })
    })
  })
  return finalUrls
}

function buildParameter(paramIn, paramName, description, required, schema){
  return {
    "in": paramIn,
    "name": paramName,
    "description": description,
    "required": required,
    "schema": schema
  }
}

function buildSwaggerPath(url, method, tags, parameters, responseStatus, failedStatus, summary){
  return {
    [url]: {
      [method]: {
        "tags": tags || ["default"],
        "summary": summary || "",
        "description": "",
        "parameters": parameters || [],
        "responses": {
          [responseStatus]: {
            "description": "operation succeeded",
          },
          [failedStatus]:{
            "description": "operation failed"
          }
        },
        // "security": []
      }
    }
  }
}

export { getSwaggerDataFromApp, starter, buildSwaggerPath, buildParameter }
