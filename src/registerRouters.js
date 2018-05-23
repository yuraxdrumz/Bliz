const RegisterRouters = ({
  _graphQlSchemas, 
  _useGraphql, 
  _graphqlMockServer, 
  _graphQlEnums,
  _injected, 
  makeExecutableSchema, 
  graphiqlExpress, 
  graphqlExpress, 
  bodyParser, 
  populateRoutersUtil, 
  _socketSubAps, 
  _useSockets, 
  populateSocketRoutersUtil, 
  populateSubAppsUtil, 
  _middleWares, 
  _routersObject, 
  _socketRoutersObject, 
  _subApps, 
  _Instance
}) => ({
  registerRouters: (...routers) => {
    // populate subApps object with sub apps passed
    populateSubAppsUtil(_middleWares, _routersObject, _subApps)
    // populate globalRoutesObject with routers passed
    populateRoutersUtil(_routersObject, routers)
    return _Instance
  },
  registerSocketRouters: (...routers) => {
    // console.log(routers)
    // TODO: add sub apps socket routers
    const delimiter = _useSockets.delimiter
    populateSocketRoutersUtil(_socketRoutersObject, routers, null, delimiter)
    // console.log(_socketRoutersObject)
    return _Instance
  },
  registerGraphQlSchemas: (...schemas) => {
    Object.assign(_graphQlSchemas, {schemas})
    return _Instance
  }
})
export default RegisterRouters
