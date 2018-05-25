import packgeJson from '../package.json'

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

import GraphQlCreator from './graphql/graphQlSchema'
import graphqlHandler from './graphql/graphQlHandler'
import { graphqlExpress, graphiqlExpress } from './apolloServer/main'
import { makeExecutableSchema, mergeSchemas, makeRemoteExecutableSchema, introspectSchema } from 'graphql-tools'
import { getIntrospectSchema } from './utils'
import ws from 'ws'
import {split} from 'apollo-client-preset'
import {getMainDefinition} from 'apollo-utilities'
import { SubscriptionServer, SubscriptionClient } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import fetch from 'node-fetch'
import { createHttpLink, HttpLink } from 'apollo-link-http'

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
const BlizApp = (BlizAppParams) => {

  const _internal = {
    _version: BlizAppParams.packgeJson.version,
    _Instance: {},
    _injected: {},
    _options: {},
    _loggerEntity: {sockets: {}, http: {}}
  }
  const _useSockets = {
    useSockets: false, 
    delimiter: ':',
    _socketRoutersObject: {},
    _socketMiddlewares: [],
    _socketSubApps: []
  }
  const _useGraphql = {
    useGraphql: false, 
    graphqlRoute:'/graphql', 
    graphiqlRoute: '/graphiql', 
    _graphQlRemoteEndpoints: [],
    _graphQlExecutableSchema: null,
    _graphQlSchemas: {},
    _graphQlDirectives: [],
    _graphQlEnums: [],
    subscriptionsEndpoint: '/subscriptions',
    useGraphiql: true,
    logger: {log: e => console.log(`Error from graphql: `, e)},
    schemaDirectives: {},
    tracing: true,
    cacheControl: {
      defaultMaxAge: 5
    }
  }

  const _useHttp = {
    useSwagger: false,
    _middleWares: [],
    _routersObject: {},
    _describe: {},
    _subApps: []
  }

  const _appData = {
    _useSockets,
    _useGraphql,
    _useHttp
  }

  const _createHandler = CreateHandler.bind(this, { ...BlizAppParams, ..._useHttp })
  const { _Instance, _options, _injected, _loggerEntity, _version } = _internal

  return Object.assign(
    _Instance,
    BlizAppParams.CreateNewObjOf({name: 'GraphQlSchema', obj: GraphQlCreator}),
    BlizAppParams.CreateNewObjOf({name: 'SocketRouter', obj: SocketRouterCreator, dependencies: {...BlizAppParams}}),
    BlizAppParams.CreateNewObjOf({name: 'SocketListener', obj: SocketListenerCreator, dependencies: {...BlizAppParams}}),
    BlizAppParams.CreateNewObjOf({name: 'Router', obj: RouterCreator, dependencies: {...BlizAppParams}}),
    BlizAppParams.CreateNewObjOf({name: 'Path', obj: PathCreator, dependencies: {...BlizAppParams}}),
    BlizAppParams.AssignHandler({name: 'sockets', obj: _useSockets, chainLink: _Instance, override: true}),
    BlizAppParams.AssignHandler({name: 'graphql', obj: _useGraphql, chainLink: _Instance, override: true}),
    BlizAppParams.AssignHandler({name: 'describe', obj: _useHttp._describe, chainLink: _Instance, override: true}),
    BlizAppParams.AssignHandler({name: 'options', obj: _options, chainLink: _Instance, override: true}),
    BlizAppParams.AssignHandler({name: 'inject', obj: _injected, chainLink: _Instance, override: true}),
    BlizAppParams.CreateObjectArray({name: 'middleware', arr: _useHttp._middleWares, chainLink: _Instance}),
    BlizAppParams.CreateObjectArray({name: 'socketMiddleware', arr: _useSockets._socketMiddlewares, chainLink: _Instance}),
    BlizAppParams.CreateArray({name: 'subApp', arr: _useHttp._subApps, chainLink: _Instance}),
    BlizAppParams.CreateArray({name: 'enum', arr: _useGraphql._graphQlEnums, chainLink: _Instance}),
    BlizAppParams.CreateArray({name: 'directive', arr: _useGraphql._graphQlDirectives, chainLink: _Instance}),
    BlizAppParams.CreateSwagger({..._appData, ...BlizAppParams, _Instance}),
    BlizAppParams.PrettyPrint({..._appData, ...BlizAppParams, _Instance, _loggerEntity}),
    BlizAppParams.RegisterRouters({..._appData, ...BlizAppParams, _Instance}),
    BlizAppParams.EventsCreator(BlizAppParams.EventEmitter),
    BlizAppParams.GetObjProps(_appData),
    BlizAppParams.Listen({_createHandler, ..._appData, ...BlizAppParams, _Instance, _version, _injected})
  )
}

const BlizCreator = () => {
  return Object.assign(
    {},
    BlizApp(BlizAppParams)
  )
}

export default BlizCreator
export { request, response, struct, superstruct, StructError }
