export default async function graphQlHandler ({schemas, server, args, enums, _useGraphql, _Instance, _injected, dependencies: {makeExecutableSchema, SubscriptionServer, introspectSchema, createHttpLink, fetch, mergeSchemas, makeRemoteExecutableSchema, getIntrospectSchema, execute, subscribe, PubSub, _version, os, print, bodyParser, graphiqlExpress, graphqlExpress}}) {
  
  let pubsub = _useGraphql.pubsub || new PubSub
  let executableSchema = null

  let finalGraphQlOptionsObject = {
    schema: executableSchema,
    logger: _useGraphql.logger,
    context: Object.assign({}, _injected, {pubsub}),
    tracing: _useGraphql.tracing,
    cacheControl: _useGraphql.cacheControl,
    schemaDirectives: _useGraphql.schemaDirectives
  }

  if(_useGraphql._graphQlRemoteEndpoints.length === 0){    
    if(_useGraphql._graphQlExecutableSchema){
      executableSchema = _useGraphql._graphQlExecutableSchema
    } else {
      let Query = `type Query{\n`
      let Mutation = `type Mutation{\n`
      let Subscription = `type Subscription{\n`
      let Types = ``
      let Enums = ``
      let resolvers = {Query: {}, Mutation: {}, Subscription: {}}
      enums.map(Enum => {
        Enums += `enum ${Enum.name}{\n${Enum.options.map(option => `\t${option}\n`).join('')}}`
      })
      schemas.map(schema => {
        const schemaProps = schema.getObjProps()
        Query += `\t${schemaProps.query}\n`
        Mutation += `\t${schemaProps.mutation}\n`
        Subscription += `\t${schemaProps.subscription}\n`
        Types += `${schemaProps.type}\n`
        if (schemaProps.resolver) {
          const { Query, Mutation, Subscription, ...props } = schemaProps.resolver
          if(Query){
            Object.assign(resolvers.Query, Query)
          }
          if(Mutation){
            Object.assign(resolvers.Mutation, Mutation(pubsub))
          }
          if(Subscription){
            Object.assign(resolvers.Subscription, Subscription(pubsub))
          }
          Object.assign(resolvers, props)
        }
      })
      Query += '}'
      Mutation += '}'
      Subscription += '}'
      const typeDefs = `${Enums}\n${Types}\n${Query}\n${Mutation}\n${Subscription}`
      finalGraphQlOptionsObject.rootValue = resolvers
      executableSchema = makeExecutableSchema({typeDefs, resolvers})
      _useGraphql._graphQlExecutableSchema = makeExecutableSchema({typeDefs, resolvers})
    }
  } else {
    const getIntrospectSchemaWithParams = getIntrospectSchema(createHttpLink, fetch, introspectSchema, makeRemoteExecutableSchema)
    executableSchema = await Promise.all(_useGraphql._graphQlRemoteEndpoints.map(ep => getIntrospectSchemaWithParams(ep)))
    executableSchema = mergeSchemas({ schemas: executableSchema })
    _useGraphql._graphQlExecutableSchema = executableSchema
  }
  _Instance.events.emit('log')
  const router = _Instance.createRouter('/').middleware(bodyParser.json())
  if(_useGraphql.useGraphiql){
    const graphiqlRoute = _Instance.createPath(_useGraphql.graphiqlRoute).handler(graphiqlExpress({ endpointURL: _useGraphql.graphqlRoute, subscriptionsEndpoint: `ws://localhost:${args[0]}${_useGraphql.subscriptionsEndpoint}` }))
    router.get(graphiqlRoute)
  }
  finalGraphQlOptionsObject.schema = executableSchema
  const graphqlRoute = _Instance
  .createPath(_useGraphql.graphqlRoute)
  .handler(graphqlExpress(finalGraphQlOptionsObject))
  router.get(graphqlRoute).post(graphqlRoute)
  _Instance.registerRouters(router)
  if(args.length > 1){
    const server = server.listen.apply(server, args)
    SubscriptionServer.create({
      execute,
      subscribe,
      schema: _useGraphql._graphQlExecutableSchema
    }, {
      server: server,
      path: _useGraphql.subscriptionsEndpoint
    });
    return server
  } else {
    server.listen.apply(server, [
      args[0],
      ()=>print([`Listening on Bliz server ${_version} on port ${args[0]}`,
      `Platform: ${os.platform()}`,
      `Hostname: ${os.hostname()}`,
      `Architecture: ${os.arch()}`,
      `CPU Cores: ${os.cpus().length}`,
      `Memory Free: ${( ((os.freemem()/1024/1024)/(os.totalmem()/1024/1024)) * 100 ).toFixed(0)}%, ${(os.freemem()/1024/1024).toFixed(0)} MB / ${(os.totalmem()/1024/1024).toFixed(0)} MB`,
    ])])
    SubscriptionServer.create({
      execute,
      subscribe,
      schema: _useGraphql._graphQlExecutableSchema
    }, {
      server: server,
      path: _useGraphql.subscriptionsEndpoint
    });
    return server
  }
}
