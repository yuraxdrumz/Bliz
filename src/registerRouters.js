const RegisterRouters = (populateRoutersUtil, populateSubAppsUtil, middleWares, globalRoutesObject, subApps, chainLink) => ({
  registerRouters:(...routers)=>{
    populateSubAppsUtil(middleWares, globalRoutesObject, subApps)
    // populate globalRoutesObject with routers passed
    populateRoutersUtil(globalRoutesObject, routers)
    return chainLink
  }
})
export default RegisterRouters