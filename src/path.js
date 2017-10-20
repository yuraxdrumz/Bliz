import {
  CreateArray,
  AssignHandler,
  GetObjProps,
  PrettyPrint
} from './objectFactories'

const PathCreator = (path) => {
  if(path[path.length - 1] === '/' && path.length > 1){
    path = path.slice(0,path.length -1)
  }
  const PathReturn = {}
  const pathData = {
    middleWareArr:[],
    path,
    handler:null,
    errHandler:null,
    validationSchemas:[]
  }
  return Object.assign(
    PathReturn,
    CreateArray('validationSchema', pathData.validationSchemas, PathReturn),
    CreateArray('middleware',pathData.middleWareArr, PathReturn),
    AssignHandler('handler', pathData, PathReturn),
    AssignHandler('errHandler', pathData, PathReturn),
    GetObjProps(pathData)
  )
}

export default PathCreator