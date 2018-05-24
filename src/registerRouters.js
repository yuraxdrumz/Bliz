const RegisterRouters = ({_useGraphql, _useHttp, _injected, _useSockets, _Instance, populateSubAppsUtil, populateRoutersUtil, populateSocketRoutersUtil}) => ({
  registerRouters: (...routers) => {
    // populate subApps object with sub apps passed
    const { _middleWares, _routersObject, _subApps } = _useHttp
    populateSubAppsUtil(_middleWares, _routersObject, _subApps)
    // populate globalRoutesObject with routers passed
    populateRoutersUtil(_routersObject, routers)
    return _Instance
  },
  registerSocketRouters: (...routers) => {
    // console.log(routers)
    // TODO: add sub apps socket routers
    const { _socketRoutersObject } = _useSockets
    const { delimiter } = _useSockets
    populateSocketRoutersUtil(_socketRoutersObject, routers, null, delimiter)
    // console.log(_socketRoutersObject)
    return _Instance
  },
  registerGraphQlSchemas: (...schemas) => {
    const { _graphQlRemoteEndpoints } = _useGraphql
    if (_graphQlRemoteEndpoints.length > 0) {
      throw new Error('you may only registerGraphQlSchemas or registerRemoteGraphQlSchemas, not either')
    } else {
      Object.assign(_useGraphql._graphQlSchemas, {schemas})
    }
    return _Instance
  },
  registerRemoteGraphQlSchemas: (...endpoints) => {
    if (Object.keys(_useGraphql._graphQlSchemas).length > 0) {
      throw new Error('you may only registerGraphQlSchemas or registerRemoteGraphQlSchemas, not either')
    } else {
      _useGraphql._graphQlRemoteEndpoints = endpoints
      // console.log(endpoints)
    }
    return _Instance
  }
})
export default RegisterRouters
