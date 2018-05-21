import {
    CreateArray,
    AssignHandler,
    GetObjProps,
    CreateObjectArray
  } from './objectFactories'
  import { checkBaseUtil } from './utils'
  
  const GraphQlSchemaCreator = name => {
    const _graphql = {}
    const pathData = {
        name,
        type: ``,
        resolver: {}
    }
    return Object.assign(
        _graphql,
        AssignHandler('type', pathData, _graphql),
        AssignHandler('resolver', pathData.resolver, _graphql, true),
        GetObjProps(pathData),
    )
  }
  
  export default GraphQlSchemaCreator