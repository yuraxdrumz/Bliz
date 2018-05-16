import {
    CreateArray,
    AssignHandler,
    GetObjProps,
  } from './objectFactories'
  
  const CreateSocketListener = path => {
    const _PathReturn = {}
    const pathData = {
      middleWareArr:[],
      path,
      handler:null,
      errHandler:null,
      parent: null
    }
    return Object.assign(
      _PathReturn,
      AssignHandler('parent', pathData.parent, _PathReturn, true),
      CreateArray('middleware',pathData.middleWareArr, _PathReturn),
      AssignHandler('handler', pathData, _PathReturn),
      AssignHandler('errHandler', pathData, _PathReturn),
      GetObjProps(pathData),
    )
  }
  
  export default CreateSocketListener