import {
  CreateArray,
  CreateHandler,
  GetObjProps,
  Method,
  CreateNewObjOf
} from './objectFactories'

const RouterCreator = base => {
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
    Method('get', routerData, RouterReturn),
    Method('post', routerData, RouterReturn),
    Method('put', routerData, RouterReturn),
    Method('del', routerData, RouterReturn),
    CreateHandler('routerErrorHandler',routerData, RouterReturn),
    CreateArray('middleware',routerData.middleWareArr, RouterReturn),
    CreateArray('subRouter',routerData.subRouters, RouterReturn),
    GetObjProps(routerData)
  )
}

export default RouterCreator