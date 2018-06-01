// graphql handler, called from listen func when useGraphql is set to true
export default async function graphQlHandler({
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
  _version,
  SchemaDirectiveVisitor,
  GraphQLScalarType,
  GraphQLNonNull,
  defaultFieldResolver,
  GraphQLString,
  withFilter,
  createDirective
}) {
  // init executableSchema, if directives length !== to their resolvers, throw error
  let executableSchema = null
  const interfaces = _useGraphql._graphqlInterfaces
  const unions = _useGraphql._graphqlUnions
  const enums = _useGraphql._graphQlEnums
  const schemas = _useGraphql._graphQlSchemas.schemas
  // use default pubsub for subscriptions if one is not passed
  const pubsub = _useGraphql.pubsub || new PubSub()
  // init graphql object, pass all app.inject to it and pubsub
  const finalGraphQlOptionsObject = {
    schema: executableSchema,
    logger: _useGraphql.logger,
    context: Object.assign({}, _injected, { pubsub }),
    tracing: _useGraphql.tracing,
    cacheControl: _useGraphql.cacheControl,
    directiveResolvers: _useGraphql.directiveResolvers
  }
  // if remote endpoints is empty create local schemas, if not empty, create remote schemas
  if (_useGraphql._graphQlRemoteEndpoints.length === 0) {
    if (_useGraphql._graphQlExecutableSchema) {
      // if schema passed from outside use it
      executableSchema = _useGraphql._graphQlExecutableSchema
    } else {
      // create schema, run on all data received and assemble a valid schema
      let Interfaces = ``
      let Unions = ``
      let Query = `type Query{\n`
      let Mutation = `type Mutation{\n`
      let Subscription = `type Subscription{\n`
      let Types = ``
      let Enums = ``
      let resolvers = { Query: {}, Mutation: {}, Subscription: {} }
      enums.map((Enum) => {
        Enums += `enum ${Enum.name}{\n${Enum.options.map((option) => `\t${option}\n`).join('')}}\n`
      })
      unions.map(union=>{
        let types = union.types.reduce((prev,curr)=>{
          if(union.types.length - 1 === union.types.indexOf(curr)){
            return prev + curr
          } else {
            return prev += curr + ' | '
          }
        }, ``)
        Unions += `union ${union.name} = ${types}\n`
      })
      interfaces.map(Interface => {
        Interfaces += `interface ${Interface.name}{\n${Interface.fields.map((field) => `\t${field}\n`).join('')}}\n`
      })
      schemas.map((schema) => {
        const schemaProps = schema.getObjProps()
        if (schemaProps.query.length > 0) {
          Query += `${schemaProps.query.map(query=> `\t${query}\n`).join('')}`
        }
        if (schemaProps.mutation.length > 0) {
          Mutation += `${schemaProps.mutation.map(mutation=> `\t${mutation}\n`).join('')}`
        }
        if (schemaProps.subscription.length > 0) {
          Subscription += `${schemaProps.subscription.map(subscription=> `\t${subscription}\n`).join('')}`
        }
        if (schemaProps.type) {
          Types += `${schemaProps.type}\n`
        }
        if (schemaProps.resolver) {
          const { Query, Mutation, Subscription, ...props } = schemaProps.resolver
          if (Query) {
            Object.assign(resolvers.Query, typeof Query === 'function' ? Query(pubsub) : Query)
          }
          if (Mutation) {
            Object.assign(
              resolvers.Mutation,
              typeof Mutation === 'function' ? Mutation(pubsub, withFilter) : Mutation
            )
          }
          if (Subscription) {
            Object.assign(
              resolvers.Subscription,
              typeof Subscription === 'function' ? Subscription(pubsub, withFilter) : Subscription
            )
          }
          Object.assign(resolvers, props)
        }
      })
      if (Object.keys(resolvers.Query).length === 0) {
        delete resolvers.Query
      }
      if (Object.keys(resolvers.Mutation).length === 0) {
        delete resolvers.Mutation
      }
      if (Object.keys(resolvers.Subscription).length === 0) {
        delete resolvers.Subscription
      }
      Query += '}'
      Mutation += '}'
      Subscription += '}'
      let typeDefs = ``
      if (Enums !== ``) {
        typeDefs += `${Enums}\n`
      }
      if(Interfaces !== ``){
        typeDefs += `${Interfaces}\n`
      }
      if (Types !== ``) {
        typeDefs += `${Types}\n`
      }
      if (Unions !== ``) {
        typeDefs += `${Unions}\n`
      }
      if (Query !== `type Query{\n}`) {
        typeDefs += `${Query}\n`
      }
      if (Mutation !== `type Mutation{\n}`) {
        typeDefs += `${Mutation}\n`
      }
      if (Subscription !== `type Subscription{\n}`) {
        typeDefs += `${Subscription}\n`
      }
      finalGraphQlOptionsObject.rootValue = resolvers
      executableSchema = makeExecutableSchema({
        typeDefs,
        resolvers
      })
      // console.log(typeDefs)
      _useGraphql._graphQlExecutableSchema = executableSchema
    }
  } else {
    const getIntrospectSchemaWithParams = getIntrospectSchema({
      HttpLink,
      fetch,
      SubscriptionClient,
      ws,
      getMainDefinition,
      split,
      introspectSchema,
      makeRemoteExecutableSchema
    })
    // if allowPartialRemoteSchema, catch all errors to allow partial schemas fetching
    if (_useGraphql.allowPartialRemoteSchema) {
      executableSchema = await Promise.map(_useGraphql._graphQlRemoteEndpoints, async (ep) => {
        try {
          return await getIntrospectSchemaWithParams(ep)
        } catch (e) {
          _useGraphql.logger.log(e)
        }
      }).filter((item) => item !== undefined)
    } else {
      // if allowPartialRemoteSchema is false, fire promise all, if something fails, all fails
      executableSchema = await Promise.all(
        _useGraphql._graphQlRemoteEndpoints.map((ep) => getIntrospectSchemaWithParams(ep))
      )
    }
    // merge remote schemas
    executableSchema = mergeSchemas({ schemas: executableSchema })
    _useGraphql._graphQlExecutableSchema = executableSchema
  }
  const directiveCreator = createDirective(SchemaDirectiveVisitor, defaultFieldResolver)
  const injectedDirectives = _useGraphql._graphQlDirectives.reduce((prev, curr) => {
    prev[curr.name] = directiveCreator(curr.fn)
    return prev
  }, {})
  // add directives
  SchemaDirectiveVisitor.visitSchemaDirectives(
    executableSchema,
    Object.assign({}, injectedDirectives, _useGraphql.directiveResolvers)
  )
  // create bliz router and add middleware and graphiql and graphql to it
  const router = _Instance.createRouter('/').middleware(bodyParser.json())
  if (_useGraphql.useGraphiql) {
    const graphiqlRoute = _Instance.createPath(_useGraphql.graphiqlRoute).handler(
      graphiqlExpress({
        endpointURL: _useGraphql.graphqlRoute,
        subscriptionsEndpoint: `ws://localhost:${args[0]}${_useGraphql.subscriptionsEndpoint}`
      })
    )
    router.get(graphiqlRoute)
  }
  finalGraphQlOptionsObject.schema = executableSchema
  const graphqlRoute = _Instance.createPath(_useGraphql.graphqlRoute).handler(
    graphqlExpress((req) => {
      // pass headers and body to context
      Object.assign(finalGraphQlOptionsObject.context, { headers: req.headers, body: req.body })
      return finalGraphQlOptionsObject
    })
  )
  router.get(graphqlRoute).post(graphqlRoute)
  _Instance.registerRouters(router)
  _Instance.events.emit('log')
  // same as http server, only add a subscription server for graphql subscriptions
  if (args.length > 1) {
    const server = server.listen.apply(server, args)
    SubscriptionServer.create(
      {
        execute,
        subscribe,
        schema: _useGraphql._graphQlExecutableSchema
      },
      {
        server: server,
        path: _useGraphql.subscriptionsEndpoint
      }
    )
    return server
  } else {
    server.listen.apply(server, [
      args[0],
      () =>
        print([
          `Listening on Bliz server ${_version} on port ${args[0]}`,
          `Platform: ${os.platform()}`,
          `Hostname: ${os.hostname()}`,
          `Architecture: ${os.arch()}`,
          `CPU Cores: ${os.cpus().length}`,
          `Memory Free: ${(
            os.freemem() /
            1024 /
            1024 /
            (os.totalmem() / 1024 / 1024) *
            100
          ).toFixed(0)}%, ${(os.freemem() / 1024 / 1024).toFixed(0)} MB / ${(
            os.totalmem() /
            1024 /
            1024
          ).toFixed(0)} MB`
        ])
    ])
    SubscriptionServer.create(
      {
        execute,
        subscribe,
        schema: _useGraphql._graphQlExecutableSchema
      },
      {
        server: server,
        path: _useGraphql.subscriptionsEndpoint
      }
    )
    return server
  }
}
