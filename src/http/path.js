import { AssignHandler, GetObjProps, CreateObjectArray } from '../objectFactories'

import { checkBaseUtil } from '../utils'

// path creator
const PathCreator = (path) => {
  const _PathReturn = {}
  const _pathData = {
    middleWareArr: [],
    path: checkBaseUtil(path),
    describe: {},
    handler: null,
    errHandler: null,
    parent: null
  }
  return Object.assign(
    _PathReturn,
    AssignHandler({
      name: 'describe',
      obj: _pathData.describe,
      chainLink: _PathReturn,
      override: true
    }),
    AssignHandler({
      name: 'parent',
      obj: _pathData.parent,
      chainLink: _PathReturn,
      override: true
    }),
    CreateObjectArray({ name: 'middleware', arr: _pathData.middleWareArr, chainLink: _PathReturn }),
    AssignHandler({ name: 'handler', obj: _pathData, chainLink: _PathReturn }),
    AssignHandler({ name: 'errHandler', obj: _pathData, chainLink: _PathReturn }),
    GetObjProps(_pathData)
  )
}

export default PathCreator
