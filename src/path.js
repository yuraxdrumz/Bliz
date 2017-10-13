import {
  CreateArray,
  CreateHandler,
  GetObjProps
} from './objectFactories'

const PathCreator = path => {
  const PathReturn = {}
  const pathData = {
    middleWareArr:[],
    path,
    handler:null,
    errHandler:null
  }
  return Object.assign(
    PathReturn,
    CreateArray('middleware',pathData.middleWareArr, PathReturn),
    CreateHandler('handler', pathData, PathReturn),
    CreateHandler('path', pathData, PathReturn),
    CreateHandler('errHandler', pathData, PathReturn),
    GetObjProps(pathData)
  )
}

export default PathCreator