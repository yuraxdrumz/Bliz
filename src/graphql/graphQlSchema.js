import {
    AssignHandler,
    GetObjProps
  } from '../objectFactories'
  
const GraphQlSchemaCreator = type => {
    const _graphql = {}
    const _pathData = {
        type,
        resolver: {},
        mutation:``,
        mockSchema: null,
        query:``
    }
    return Object.assign(
        _graphql,
        AssignHandler('resolver', _pathData.resolver, _graphql, true),
        AssignHandler('mockSchema', _pathData, _graphql),
        AssignHandler('mutation', _pathData, _graphql),
        AssignHandler('query', _pathData, _graphql),
        GetObjProps(_pathData),
    )
}

export default GraphQlSchemaCreator
