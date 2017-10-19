import {
  CreateArray,
  AssignHandler,
  GetObjProps
} from './objectFactories'

const PathCreator = path => {
  const PathReturn = {}
  const pathData = {
    middleWareArr:[],
    path,
    handler:null,
    errHandler:null,
    validationSchema:null
  }
  return Object.assign(
    PathReturn,
    AssignHandler('validationSchema', pathData, PathReturn),
    CreateArray('middleware',pathData.middleWareArr, PathReturn),
    AssignHandler('handler', pathData, PathReturn),
    AssignHandler('errHandler', pathData, PathReturn),
    GetObjProps(pathData)
  )
}

export default PathCreator