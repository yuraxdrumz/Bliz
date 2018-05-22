const RegisterRouters = ({
  populateRoutersUtil, 
  populateSocketRoutersUtil,
  populateSubAppsUtil, 
  _useSockets,
  _middleWares, 
  _routersObject, 
  _socketRoutersObject,
  _subApps, 
  _Instance,
  _graphQlSchemas,
  _useGraphql,
  graphqlExpress,
  graphiqlExpress,
  bodyParser,
  _injected,
  makeExecutableSchema
}) => ({
  registerRouters:(...routers)=>{
    // populate subApps object with sub apps passed
    populateSubAppsUtil(_middleWares, _routersObject, _subApps)
    // populate globalRoutesObject with routers passed
    populateRoutersUtil(_routersObject, routers)
    return _Instance
  },
  registerSocketRouters:(...routers)=>{
    // console.log(routers)
    // TODO: add sub apps socket routers
    const delimiter = _useSockets.delimiter
    populateSocketRoutersUtil(_socketRoutersObject, routers, null, delimiter)
    // console.log(_socketRoutersObject)
    return _Instance
  },
  registerGraphQlSchemas:(...schemas)=>{
    let Query = `type Query{\n`
    let Mutation = `type Mutation{\n`
    let Types = ``
    let resolvers = {Query: {}, Mutation: {}}
    schemas.map(schema=>{
      const schemaProps = schema.getObjProps()
      Object.assign(_graphQlSchemas, {[schemaProps.query]: schemaProps})
      Query += `\t${schemaProps.query}\n`
      Mutation += `\t${schemaProps.mutation}\n`
      Types += `${schemaProps.type}\n`
      if(schemaProps.resolver.Query){
        const { Query, ...props } = schemaProps.resolver
        Object.assign(resolvers.Query, Query)
        Object.assign(resolvers, props)
      } 
      if (schemaProps.resolver.Mutation){
        const { Mutation, ...props } = schemaProps.resolver
        Object.assign(resolvers.Mutation, Mutation)
        Object.assign(resolvers, props)
      } 
      if(!schemaProps.resolver.Mutation && !schemaProps.resolver.Query) {
        Object.assign(resolvers, schemaProps.resolver)
      }
    })
    Query += '}'
    Mutation += '}'
    const typeDefs = `${Types}\n${Query}\n${Mutation}`
    const executableSchema = makeExecutableSchema({typeDefs, resolvers})
    const graphiqlRoute = _Instance.createPath(_useGraphql.graphiqlRoute).handler(graphiqlExpress({ endpointURL: _useGraphql.graphqlRoute }))
    const graphqlRoute = _Instance
    .createPath(_useGraphql.graphqlRoute)
    .handler(graphqlExpress({
      schema: executableSchema, 
      rootValue: resolvers, 
      logger:{ log: e => console.log(`Error rom graphql: `, e)}, 
      context: _injected,
      tracing: true,
      cacheControl: {
        defaultMaxAge: 5
      }
    }))
    const router = _Instance.createRouter('/').get(graphqlRoute).post(graphqlRoute).get(graphiqlRoute).middleware(bodyParser.json())
    _Instance.registerRouters(router)
    return _Instance
  }
})
export default RegisterRouters
