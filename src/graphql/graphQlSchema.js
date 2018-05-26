import { AssignHandler, GetObjProps } from '../objectFactories'

// graphql schema creator
const GraphQlSchemaCreator = (type) => {
  const _graphql = {}
  const _pathData = {
    type,
    resolver: {},
    mutation: ``,
    subscription: ``,
    mockSchema: null,
    query: ``
  }
  return Object.assign(
    _graphql,
    AssignHandler({
      name: 'resolver',
      obj: _pathData.resolver,
      chainLink: _graphql,
      override: true
    }),
    AssignHandler({ name: 'mockSchema', obj: _pathData, chainLink: _graphql }),
    AssignHandler({ name: 'mutation', obj: _pathData, chainLink: _graphql }),
    AssignHandler({ name: 'subscription', obj: _pathData, chainLink: _graphql }),
    AssignHandler({ name: 'query', obj: _pathData, chainLink: _graphql }),
    GetObjProps(_pathData)
  )
}

export default GraphQlSchemaCreator
