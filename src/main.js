// package json
import packgeJson from '../package.json'

// http dependencies
import RouterCreator from './http/router'
import PathCreator from './http/path'
import defaultHandler from './http/defaultHandler'
import CreateHandler from './http/handler'
import request from './http/request'
import response from './http/response'
import midHandler, { socketMiddlewareHandler } from './middlewareHandler'
import SocketRouterCreator from './sockets/socketRouter'
import SocketListenerCreator from './sockets/socketListener'
import socketHandler from './sockets/socketHandler'

// graphql dependencies
import GraphQlCreator from './graphql/graphQlSchema'
import graphqlHandler from './graphql/graphQlHandler'
import { graphqlExpress, graphiqlExpress } from './apolloServer/main'
import {
  makeExecutableSchema,
  mergeSchemas,
  makeRemoteExecutableSchema,
  introspectSchema
} from 'graphql-tools'
import { getIntrospectSchema } from './utils'
import ws from 'ws'
import { split } from 'apollo-client-preset'
import { getMainDefinition } from 'apollo-utilities'
import { SubscriptionServer, SubscriptionClient } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import fetch from 'node-fetch'
import { createHttpLink, HttpLink } from 'apollo-link-http'

// app dependencies
import * as factories from './objectFactories'
import * as utils from './utils'
import RegisterRouters from './registerRouters'
import { pathDescribe, mainDescribe, schemas } from './http/openApi'
import bodyParser from 'body-parser'
import http from 'http'
import fs from 'fs'
import treeify from 'treeify'
import { struct, superstruct, StructError } from 'superstruct'
import EventEmitter from 'eventemitter2'
import Promise from 'bluebird'
import { stringify } from 'json-to-pretty-yaml'
import print from 'print-message'
import os from 'os'
import io from 'socket.io'

const httpDependencies = {
  RouterCreator,
  PathCreator,
  defaultHandler,
  CreateHandler,
  request,
  response,
  midHandler,
  pathDescribe,
  mainDescribe,
  schemas
}

const graphqlDependencies = {
  GraphQlCreator,
  graphqlExpress,
  graphiqlExpress,
  graphqlHandler,
  SubscriptionServer,
  execute,
  subscribe,
  PubSub,
  mergeSchemas,
  makeRemoteExecutableSchema,
  getIntrospectSchema,
  fetch,
  introspectSchema,
  createHttpLink,
  HttpLink,
  SubscriptionClient,
  ws,
  getMainDefinition,
  split
}

const socketDependencies = {
  SocketListenerCreator,
  SocketRouterCreator,
  socketMiddlewareHandler,
  socketHandler
}

const superStructObject = {
  struct,
  superstruct,
  StructError
}

const appDependencies = {
  bodyParser,
  http,
  io,
  makeExecutableSchema,
  fs,
  treeify,
  EventEmitter,
  Promise,
  stringify,
  print,
  os,
  packgeJson,
  RegisterRouters
}

// combining all dependencies to one object for convenience.
const BlizAppParams = {
  ...utils,
  ...factories,
  ...httpDependencies,
  ...graphqlDependencies,
  ...socketDependencies,
  ...appDependencies,
  superStructObject
}

// main instance creator, returns an instance of bliz app
// using concatanative inheritance + RORO (receive object return object)
const BlizApp = (BlizAppParams) => {
  // internal information
  // _Instance - all instance data
  // _injected - all data passed, will be injected to all handlers
  // _options - options object, still did not implement anything for it
  // _loggerEntity - holds the structure of sockets and http routes when calling pretty print
  const _internal = {
    _version: BlizAppParams.packgeJson.version,
    _Instance: {},
    _injected: {},
    _options: {},
    _loggerEntity: { sockets: {}, http: {} }
  }
  // socekt.io object, _socketSubApps was not yet implemented
  const _useSockets = {
    useSockets: false,
    delimiter: ':',
    _socketRoutersObject: {},
    _socketMiddlewares: [],
    _socketSubApps: []
  }
  // graphql config object
  const _useGraphql = {
    useGraphql: false,
    graphqlRoute: '/graphql',
    graphiqlRoute: '/graphiql',
    _graphQlRemoteEndpoints: [],
    _graphQlExecutableSchema: null,
    _graphQlSchemas: {},
    _graphQlDirectives: [],
    _graphQlEnums: [],
    subscriptionsEndpoint: '/subscriptions',
    useGraphiql: true,
    logger: { log: (e) => console.log(`Error from graphql: `, e) },
    directiveResolvers: {},
    tracing: true,
    cacheControl: {
      defaultMaxAge: 5
    }
  }
  // http object, _describe is added by each component as .describe, used for swagger.yaml generation
  const _useHttp = {
    useSwagger: false,
    _middleWares: [],
    _routersObject: {},
    _describe: {},
    _subApps: []
  }

  // entire app data, used when calling getObjProps() on app
  const _appData = {
    _useSockets,
    _useGraphql,
    _useHttp
  }

  // binding all data and dependencies to the http handler
  const _createHandler = CreateHandler.bind(this, { ...BlizAppParams, ..._useHttp })
  // destructuring for passing to allow chaining on methods
  const { _Instance, _options, _injected, _loggerEntity, _version } = _internal

  // call all function and pass dependencies to them and compose methods, put all on the Instance object
  return Object.assign(
    _Instance,
    BlizAppParams.CreateNewObjOf({ name: 'GraphQlSchema', obj: GraphQlCreator }),
    BlizAppParams.CreateNewObjOf({
      name: 'SocketRouter',
      obj: SocketRouterCreator,
      dependencies: { ...BlizAppParams }
    }),
    BlizAppParams.CreateNewObjOf({
      name: 'SocketListener',
      obj: SocketListenerCreator,
      dependencies: { ...BlizAppParams }
    }),
    BlizAppParams.CreateNewObjOf({
      name: 'Router',
      obj: RouterCreator,
      dependencies: { ...BlizAppParams }
    }),
    BlizAppParams.CreateNewObjOf({
      name: 'Path',
      obj: PathCreator,
      dependencies: { ...BlizAppParams }
    }),
    BlizAppParams.AssignHandler({
      name: 'sockets',
      obj: _useSockets,
      chainLink: _Instance,
      override: true
    }),
    BlizAppParams.AssignHandler({
      name: 'graphql',
      obj: _useGraphql,
      chainLink: _Instance,
      override: true
    }),
    BlizAppParams.AssignHandler({
      name: 'describe',
      obj: _useHttp._describe,
      chainLink: _Instance,
      override: true
    }),
    BlizAppParams.AssignHandler({
      name: 'options',
      obj: _options,
      chainLink: _Instance,
      override: true
    }),
    BlizAppParams.AssignHandler({
      name: 'inject',
      obj: _injected,
      chainLink: _Instance,
      override: true
    }),
    BlizAppParams.CreateObjectArray({
      name: 'middleware',
      arr: _useHttp._middleWares,
      chainLink: _Instance
    }),
    BlizAppParams.CreateObjectArray({
      name: 'socketMiddleware',
      arr: _useSockets._socketMiddlewares,
      chainLink: _Instance
    }),
    BlizAppParams.CreateArray({ name: 'subApp', arr: _useHttp._subApps, chainLink: _Instance }),
    BlizAppParams.CreateArray({
      name: 'enum',
      arr: _useGraphql._graphQlEnums,
      chainLink: _Instance
    }),
    BlizAppParams.CreateArray({
      name: 'directive',
      arr: _useGraphql._graphQlDirectives,
      chainLink: _Instance
    }),
    BlizAppParams.CreateSwagger({ ..._appData, ...BlizAppParams, _Instance }),
    BlizAppParams.PrettyPrint({ ..._appData, ...BlizAppParams, _Instance, _loggerEntity }),
    BlizAppParams.RegisterRouters({ ..._appData, ...BlizAppParams, _Instance }),
    BlizAppParams.EventsCreator(BlizAppParams.EventEmitter),
    BlizAppParams.GetObjProps(_appData),
    BlizAppParams.Listen({
      _createHandler,
      ..._appData,
      ...BlizAppParams,
      _Instance,
      _version,
      _injected
    })
  )
}

// exposed factory to create a new instance
const BlizCreator = () => {
  return Object.assign({}, BlizApp(BlizAppParams))
}

// expose factory and superstruct for validation, request + response for extending http req and res
export default BlizCreator
export { request, response, struct, superstruct, StructError }
