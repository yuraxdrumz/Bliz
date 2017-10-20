import {
  CreateArray,
  AssignHandler,
  GetObjProps,
  Method,
  PrettyPrint
} from './objectFactories'
import { checkBaseUtil } from './utils'
const RouterCreator = (base, dependencies) => {
  const checkedBase = checkBaseUtil(base)
  const RouterReturn = {}
  const routerData = {
    base:checkedBase,
    get: {},
    post: {},
    put : {},
    del :{},
    middleWareArr :[],
    subRouters:[],
    routerErrorHandler: null,
  }
  return Object.assign(
    RouterReturn,
    PrettyPrint(dependencies[0], routerData),
    Method('get', routerData, RouterReturn),
    Method('post', routerData, RouterReturn),
    Method('put', routerData, RouterReturn),
    Method('del', routerData, RouterReturn),
    AssignHandler('routerErrorHandler',routerData, RouterReturn),
    CreateArray('middleware',routerData.middleWareArr, RouterReturn),
    CreateArray('subRouter',routerData.subRouters, RouterReturn),
    GetObjProps(routerData)
  )
}

export default RouterCreator