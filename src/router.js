import {
  CreateArray,
  AssignHandler,
  GetObjProps,
  Method,
  PrettyPrint
} from './objectFactories'

const RouterCreator = (base, deps) => {
  if(base[base.length - 1] === '/' && base.length > 1){
    base = base.slice(0,base.length -1)
  }
  const RouterReturn = {}
  const routerData = {
    base,
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
    PrettyPrint(deps[0], routerData),
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