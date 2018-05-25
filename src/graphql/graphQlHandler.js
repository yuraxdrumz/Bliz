export default async function graphQlHandler ({
  server, 
  args,
  _useGraphql,
  _internal,
  PubSub,
  makeExecutableSchema,
  getIntrospectSchema,
  createHttpLink,
  HttpLink,
  fetch, 
  introspectSchema, 
  makeRemoteExecutableSchema,
  mergeSchemas,
  bodyParser,
  graphiqlExpress,
  graphqlExpress,
  SubscriptionServer,
  SubscriptionClient, 
  ws, 
  getMainDefinition, 
  split,
  os,
  print,
  execute,
  subscribe,
  Promise,
  _injected,
  _Instance,
  _version
}) {
  let executableSchema = null
  const directives = _useGraphql._graphQlDirectives
  if(directives.length !== Object.keys(_useGraphql.directiveResolvers).length){
    throw new Error(`Directive resolvers registered does not match directive declarations`)
  }
  const enums = _useGraphql._graphQlEnums
  const schemas = _useGraphql._graphQlSchemas.schemas
  const pubsub = _useGraphql.pubsub || new PubSub()
  const finalGraphQlOptionsObject = {
    schema: executableSchema,
    logger: _useGraphql.logger,
    context: Object.assign({}, _injected, {pubsub}),
    tracing: _useGraphql.tracing,
    cacheControl: _useGraphql.cacheControl,
    directiveResolvers: _useGraphql.directiveResolvers
  }

  if(_useGraphql._graphQlRemoteEndpoints.length === 0){    
    if(_useGraphql._graphQlExecutableSchema){
      executableSchema = _useGraphql._graphQlExecutableSchema
    } else {
      let Directives = ``
      let Query = `type Query{\n`
      let Mutation = `type Mutation{\n`
      let Subscription = `type Subscription{\n`
      let Types = ``
      let Enums = ``
      let resolvers = {Query: {}, Mutation: {}, Subscription: {}}
      enums.map(Enum => {
        Enums += `enum ${Enum.name}{\n${Enum.options.map(option => `\t${option}\n`).join('')}}\n`
      })
      directives.map(dir=>{
        Directives += dir.includes('directive') ? `${dir}\n` : `directive ${dir}\n`
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
      const typeDefs = `${Directives}\n${Enums}\n${Types}\n${Query}\n${Mutation}\n${Subscription}`
      finalGraphQlOptionsObject.rootValue = resolvers
      executableSchema = makeExecutableSchema({typeDefs, resolvers, directiveResolvers: _useGraphql.directiveResolvers})
      _useGraphql._graphQlExecutableSchema = executableSchema
    }
  } else {
    const getIntrospectSchemaWithParams = getIntrospectSchema({HttpLink, fetch, SubscriptionClient, ws, getMainDefinition, split, introspectSchema, makeRemoteExecutableSchema})

    if(_useGraphql.allowPartialRemoteSchema){
      executableSchema = await Promise.map(_useGraphql._graphQlRemoteEndpoints, async ep => {
        try{
          return await getIntrospectSchemaWithParams(ep)
        }catch(e){
          _useGraphql.logger.log(e)
        }
      }).filter(item=> item !== undefined)
    } else {
      executableSchema = await Promise.all(_useGraphql._graphQlRemoteEndpoints.map(ep => getIntrospectSchemaWithParams(ep)))
    }
    executableSchema = mergeSchemas({ schemas: executableSchema })
    _useGraphql._graphQlExecutableSchema = executableSchema
  }
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
  _Instance.events.emit('log')
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
