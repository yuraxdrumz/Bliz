import {
    CreateArray,
    AssignHandler,
    GetObjProps,
    CreateObjectArray
  } from '../objectFactories'
  import { checkBaseUtil } from '../utils'
  
  const GraphQlSchemaCreator = type => {
    const _graphql = {}
    const pathData = {
        type,
        resolver: {},
        mutation:``,
        query:``
    }
    return Object.assign(
        _graphql,
        AssignHandler('resolver', pathData.resolver, _graphql, true),
        AssignHandler('mutation', pathData, _graphql),
        AssignHandler('query', pathData, _graphql),
        GetObjProps(pathData),
    )
  }
  
  export default GraphQlSchemaCreator