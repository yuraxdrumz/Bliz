import {
  CreateMiddleWare,
  CreateHandler,
  GetObjProps,
  Method
} from './objectFactories'

const RouterCreator = base => {
  const RouterReturn = {}
  const routerData = {
    base,
    get: {},
    post: {},
    put : {},
    deleted :{},
    middleWareArr :[],
    routerErrorHandler: null,
  }
  return Object.assign(
    RouterReturn,
    Method('get', routerData, RouterReturn),
    Method('post', routerData, RouterReturn),
    Method('put', routerData, RouterReturn),
    Method('delete', routerData, RouterReturn),
    CreateHandler('routerErrorHandler',routerData, RouterReturn),
    CreateMiddleWare(routerData.middleWareArr, RouterReturn),
    GetObjProps(routerData)
  )
}

export default RouterCreator