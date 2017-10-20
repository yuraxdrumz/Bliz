import {
  CreateArray,
  AssignHandler,
  GetObjProps,
} from './objectFactories'
import { checkBaseUtil } from './utils'

const PathCreator = path => {
  const _checkedPath = checkBaseUtil(path)
  const _PathReturn = {}
  const pathData = {
    middleWareArr:[],
    path:_checkedPath,
    handler:null,
    errHandler:null,
    validationSchemas:[]
  }
  return Object.assign(
    _PathReturn,
    CreateArray('validationSchema', pathData.validationSchemas, _PathReturn),
    CreateArray('middleware',pathData.middleWareArr, _PathReturn),
    AssignHandler('handler', pathData, _PathReturn),
    AssignHandler('errHandler', pathData, _PathReturn),
    GetObjProps(pathData)
  )
}

export default PathCreator