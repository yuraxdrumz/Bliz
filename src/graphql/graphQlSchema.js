import { AssignHandler, GetObjProps, CreateArray } from '../objectFactories'

// graphql schema creator
const GraphQlSchemaCreator = (type) => {
  const _graphql = {}
  const _pathData = {
    type,
    resolver: {},
    mutation: [],
    subscription: [],
    mockSchema: null,
    query: [],
    dataLoader: []
  }
  return Object.assign(
    _graphql,
    AssignHandler({
      name: 'resolver',
      obj: _pathData.resolver,
      chainLink: _graphql,
      override: true
    }),
    CreateArray({
      name: 'dataLoader',
      arr: _pathData.dataLoader,
      chainLink: _graphql
    }),
    AssignHandler({ name: 'mockSchema', obj: _pathData, chainLink: _graphql }),
    CreateArray({ name: 'mutation', arr: _pathData.mutation, chainLink: _graphql }),
    CreateArray({ name: 'subscription', arr: _pathData.subscription, chainLink: _graphql }),
    CreateArray({ name: 'query', arr: _pathData.query, chainLink: _graphql }),
    GetObjProps(_pathData)
  )
}

export default GraphQlSchemaCreator
