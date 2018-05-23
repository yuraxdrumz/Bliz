import {
    CreateObjectArray,
    AssignHandler,
    GetObjProps
} from '../objectFactories'

const CreateSocketListener = path => {
  const _PathReturn = {}
  const pathData = {
    middleWareArr: [],
    path,
    handler: null,
    errHandler: null
  }
  return Object.assign(
    _PathReturn,
    CreateObjectArray({name: 'middleware', arr: pathData.middleWareArr, chainLink: _PathReturn}),
    AssignHandler({name: 'handler', obj: pathData, chainLink: _PathReturn}),
    AssignHandler({name: 'errHandler', obj: pathData, chainLink: _PathReturn}),
    GetObjProps(pathData)
  )
}

export default CreateSocketListener
