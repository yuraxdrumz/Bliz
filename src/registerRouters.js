const RegisterRouters = (populateRoutersUtil, populateSubAppsUtil, middleWares, globalRoutesObject, subApps, chainLink) => ({
  registerRouters:(...routers)=>{
    // populate subApps object with sub apps passed
    populateSubAppsUtil(middleWares, globalRoutesObject, subApps)
    // populate globalRoutesObject with routers passed
    populateRoutersUtil(globalRoutesObject, routers)
    return chainLink
  }
})
export default RegisterRouters