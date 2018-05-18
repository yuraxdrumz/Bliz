import {
    CreateObjectArray,
    CreateArray,
    AssignHandler,
    GetObjProps,
    Method
  } from './objectFactories'
  
  const SocketRouterCreator = base => {
    const _RouterReturn = {}
    const routerData = {
      base,
      event: {},
      middleWareArr :[],
      subRouters:[],
      routerErrorHandler: null,
    }
    return Object.assign(
      _RouterReturn,
      Method('event', routerData, _RouterReturn),
      AssignHandler('routerErrorHandler',routerData, _RouterReturn),
      CreateObjectArray('middleware',routerData.middleWareArr, _RouterReturn),
      CreateArray('socketSubRouter',routerData.subRouters, _RouterReturn),
      GetObjProps(routerData)
    )
  }
  
  export default SocketRouterCreator