const RegisterRouters = ({
  populateRoutersUtil, 
  populateSocketRoutersUtil,
  populateSubAppsUtil, 
  _useSockets,
  _middleWares, 
  _routersObject, 
  _socketRoutersObject,
  _subApps, 
  _Instance,
  _graphQlSchemas,
  _useGraphql,
  graphqlExpress,
  graphiqlExpress,
  bodyParser
}) => ({
  registerRouters:(...routers)=>{
    // populate subApps object with sub apps passed
    populateSubAppsUtil(_middleWares, _routersObject, _subApps)
    // populate globalRoutesObject with routers passed
    populateRoutersUtil(_routersObject, routers)
    return _Instance
  },
  registerSocketRouters:(...routers)=>{
    // console.log(routers)
    // TODO: add sub apps socket routers
    const delimiter = _useSockets.delimiter
    populateSocketRoutersUtil(_socketRoutersObject, routers, null, delimiter)
    // console.log(_socketRoutersObject)
    return _Instance
  },
  registerGraphQlSchemas:(...schemas)=>{
    if (!_useGraphql._addedGraphRoute) {
      _useGraphql._addedGraphRoute = true
      const graphiqlRoute = _Instance.createPath(_useGraphql.graphiqlRoute).handler(graphiqlExpress({ endpointURL: _useGraphql.graphqlRoute }))
      const graphqlRoute = _Instance
      .createPath(_useGraphql.graphqlRoute)
      .handler(graphqlExpress({schema: _useGraphql.executableSchema, rootValue: _useGraphql.resolvers}))
      const router = _Instance.createRouter('/').get(graphqlRoute).post(graphqlRoute).get(graphiqlRoute).middleware(bodyParser.json())
      _Instance.registerRouters(router)
    }
    // console.log(schemas)
    // _graphQlSchemas, schemas
    return _Instance
  }
})
export default RegisterRouters
