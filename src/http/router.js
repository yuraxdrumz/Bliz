import {
  CreateArray,
  CreateObjectArray,
  AssignHandler,
  GetObjProps,
  Method
} from '../objectFactories'
import { checkBaseUtil } from '../utils'

// router creator
const RouterCreator = (base) => {
  const _RouterReturn = {}
  const _routerData = {
    base: checkBaseUtil(base),
    get: {},
    post: {},
    put: {},
    del: {},
    middleWareArr: [],
    subRouters: [],
    routerErrorHandler: null
  }
  return Object.assign(
    _RouterReturn,
    Method('get', _routerData, _RouterReturn),
    Method('post', _routerData, _RouterReturn),
    Method('put', _routerData, _RouterReturn),
    Method('del', _routerData, _RouterReturn),
    AssignHandler({ name: 'routerErrorHandler', obj: _routerData, chainLink: _RouterReturn }),
    CreateObjectArray({
      name: 'middleware',
      arr: _routerData.middleWareArr,
      chainLink: _RouterReturn
    }),
    CreateArray({ name: 'subRouter', obj: _routerData.subRouters, chainLink: _RouterReturn }),
    GetObjProps(_routerData)
  )
}

export default RouterCreator
