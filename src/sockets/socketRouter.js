import {
  CreateObjectArray,
  CreateArray,
  AssignHandler,
  GetObjProps,
  Method
} from '../objectFactories'

// socket router creator
const SocketRouterCreator = (base) => {
  const _RouterReturn = {}
  const routerData = {
    base,
    event: {},
    middleWareArr: [],
    subRouters: [],
    routerErrorHandler: null
  }
  return Object.assign(
    _RouterReturn,
    Method('event', routerData, _RouterReturn),
    AssignHandler({ name: 'routerErrorHandler', obj: routerData, chainLink: _RouterReturn }),
    CreateObjectArray({
      name: 'middleware',
      arr: routerData.middleWareArr,
      chainLink: _RouterReturn
    }),
    CreateArray({ name: 'socketSubRouter', arr: routerData.subRouters, chainLink: _RouterReturn }),
    GetObjProps(routerData)
  )
}

export default SocketRouterCreator
