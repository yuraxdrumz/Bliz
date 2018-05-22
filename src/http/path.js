import {
  CreateArray,
  AssignHandler,
  GetObjProps,
  CreateObjectArray
} from '../objectFactories'
import { checkBaseUtil } from '../utils'

const PathCreator = path => {
  const _checkedPath = checkBaseUtil(path)
  const _PathReturn = {}
  const pathData = {
    middleWareArr:[],
    path:_checkedPath,
    describe: {},
    handler:null,
    errHandler:null,
    parent: null
  }
  return Object.assign(
    _PathReturn,
    AssignHandler('describe', pathData.describe, _PathReturn, true),
    AssignHandler('parent', pathData.parent, _PathReturn, true),
    CreateObjectArray('middleware',pathData.middleWareArr, _PathReturn),
    AssignHandler('handler', pathData, _PathReturn),
    AssignHandler('errHandler', pathData, _PathReturn),
    GetObjProps(pathData),
  )
}

export default PathCreator