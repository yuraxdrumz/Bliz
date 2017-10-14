const RegisterRouters = (populateRoutersUtil, globalRoutesObject, chainLink) => ({
  registerRouters:(...routers)=>{
    // populate globalRoutesObject with routers passed
    populateRoutersUtil(globalRoutesObject, routers)
    return chainLink
  }
})

export default RegisterRouters