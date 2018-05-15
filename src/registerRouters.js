
const RegisterRouters = ({
  populateRoutersUtil, 
  populateSubAppsUtil, 
  _middleWares, 
  _routersObject, 
  _subApps, 
  _Instance
}) => ({
  registerRouters:(...routers)=>{
    // populate subApps object with sub apps passed
    populateSubAppsUtil(_middleWares, _routersObject, _subApps)
    // populate globalRoutesObject with routers passed
    populateRoutersUtil(_routersObject, routers)
    return _Instance
  }
})
export default RegisterRouters