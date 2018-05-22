import {
    AssignHandler,
    GetObjProps
  } from '../objectFactories'
  
const GraphQlSchemaCreator = type => {
    const _graphql = {}
    const pathData = {
        type,
        resolver: {},
        mutation:``,
        mockSchema: null,
        query:``
    }
    return Object.assign(
        _graphql,
        AssignHandler('resolver', pathData.resolver, _graphql, true),
        AssignHandler('mockSchema', pathData, _graphql),
        AssignHandler('mutation', pathData, _graphql),
        AssignHandler('query', pathData, _graphql),
        GetObjProps(pathData),
    )
}

export default GraphQlSchemaCreator
