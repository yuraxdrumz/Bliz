const RegisterRouters = ({
  populateRoutersUtil, 
  populateSocketRoutersUtil,
  populateSubAppsUtil, 
  _useSockets,
  _middleWares, 
  _routersObject, 
  _socketRoutersObject,
  _subApps, 
  _Instance
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
    const delimiter = _useSockets.delimiter
    populateSocketRoutersUtil(_socketRoutersObject, routers, null, delimiter)
    // console.log(_socketRoutersObject)
    return _Instance
  }
})
export default RegisterRouters
