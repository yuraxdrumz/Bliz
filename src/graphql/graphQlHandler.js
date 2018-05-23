import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

export default function graphQlHandler ({schemas, server, args, enums, _useGraphql, _Instance, _injected, dependencies: {makeExecutableSchema, _version, os, print, bodyParser, graphiqlExpress, graphqlExpress}}) {
  const pubsub = new PubSub();
  let Query = `type Query{\n`
  let Mutation = `type Mutation{\n`
  let Subscription = `type Subscription{\n`
  let Types = ``
  let Enums = ``
  let resolvers = {Query: {}, Mutation: {}, Subscription:{}}
  enums.map(Enum => {
    if (Enum.includes('enum')) {
      Enums += `${Enum}\n`
    } else {
      Enums += `enum ${Enum}\n`
    }
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
  const executableSchema = makeExecutableSchema({typeDefs, resolvers})
  _useGraphql._graphQlExecutableSchema = executableSchema
  const graphiqlRoute = _Instance.createPath(_useGraphql.graphiqlRoute).handler(graphiqlExpress({ endpointURL: _useGraphql.graphqlRoute, subscriptionsEndpoint: `ws://localhost:${args[0]}/subscriptions` }))
  const graphqlRoute = _Instance
  .createPath(_useGraphql.graphqlRoute)
  .handler(graphqlExpress({
    schema: executableSchema,
    rootValue: resolvers,
    logger:{ log: e => console.log(`Error from graphql: `, e)},
    context: _injected,
    tracing: true,
    cacheControl: {
      defaultMaxAge: 5
    }
  }))
  const router = _Instance.createRouter('/').get(graphqlRoute).post(graphqlRoute).get(graphiqlRoute).middleware(bodyParser.json())
  _Instance.registerRouters(router)

  if(args.length > 1){
    const server = server.listen.apply(server, args)
    SubscriptionServer.create({
      execute,
      subscribe,
      schema: executableSchema
    }, {
      server: server,
      path: '/subscriptions'
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
      schema: executableSchema
    }, {
      server: server,
      path: '/subscriptions'
    });
    return server
  }
}
