import {
  CreateArray,
  AssignHandler,
  GetObjProps,
  Method,
} from './objectFactories'
import { checkBaseUtil } from './utils'

const RouterCreator = base => {
  const _checkedBase = checkBaseUtil(base)
  const _RouterReturn = {}
  const routerData = {
    base:_checkedBase,
    get: {},
    post: {},
    put : {},
    del :{},
    middleWareArr :[],
    subRouters:[],
    routerErrorHandler: null,
  }
  return Object.assign(
    _RouterReturn,
    Method('get', routerData, _RouterReturn),
    Method('post', routerData, _RouterReturn),
    Method('put', routerData, _RouterReturn),
    Method('del', routerData, _RouterReturn),
    AssignHandler('routerErrorHandler',routerData, _RouterReturn),
    CreateArray('middleware',routerData.middleWareArr, _RouterReturn),
    CreateArray('subRouter',routerData.subRouters, _RouterReturn),
    GetObjProps(routerData)
  )
}

export default RouterCreator