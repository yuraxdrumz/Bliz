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
import { makeExecutableSchema } from 'graphql-tools'

import * as factories from './objectFactories'
import * as utils from './utils'
import RegisterRouters from './registerRouters'

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
  midHandler
}

const graphqlDependencies = {
  GraphQlCreator,
  graphqlExpress,
  graphiqlExpress,
  graphqlHandler
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
  os
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

  const { 
    GraphQlCreator, 
    graphqlHandler,
    treeify, 
    SocketRouterCreator, 
    SocketListenerCreator, 
    RouterCreator,  
    PathCreator,
    stringify,
    fs,
    populateObjectWithTreeUtil,
    makeExecutableSchema, 
    graphiqlExpress, 
    graphqlExpress, 
    bodyParser,
    populateSocketRoutersUtil, 
    populateSubAppsUtil, 
    populateRoutersUtil, 
    EventEmitter,
    checkSubRouters,
    socketMiddlewareHandler,
    http, 
    print, 
    os,
    CreateNewObjOf,
    AssignHandler,
    CreateObjectArray,
    CreateArray,
    CreateSwagger,
    PrettyPrint,
    EventsCreator,
    GetObjProps,
    Listen,
    urlUtil,
    handleNestedRoutersUtil,
    populateParamsUtil,
    populateQueryUtil,
    populateUrlOptions,
    io,
    Promise
  } = BlizAppParams

  const _version             = packgeJson.version
  const _Instance            = {}
  const _loggerEntity        = {sockets: {}, http: {}}
  const _middleWares         = []
  const _socketMiddlewares   = []
  const _routersObject       = {}
  const _socketRoutersObject = {}
  const _injected            = {}
  const _useSockets          = {enabled: false, delimiter: ':'}
  const _useGraphql          = {enabled: false, graphqlRoute:'/graphql', graphiqlRoute: '/graphiql', _graphQlExecutableSchema: null}
  const _useSwagger          = {enabled: false}
  const _options             = {}
  const _describe            = {}
  const _graphQlSchemas      = {}
  const _graphQlEnums        = []
  const _createHandler       = CreateHandler.bind(this, { request, response , Promise, defaultHandler, midHandler, superStructObject, urlUtil, handleNestedRoutersUtil, populateParamsUtil, populateQueryUtil, populateUrlOptions, _middleWares, _routersObject, _injected, _Instance, _useSwagger })
  const _subApps = []
  const _socketSubApps = []

  const _appData = {
    _version,
    _loggerEntity,
    _middleWares,
    _socketMiddlewares,
    _routersObject,
    _socketRoutersObject,
    _injected,
    _useSockets,
    _useGraphql,
    _useSwagger,
    _options,
    _describe,
    _graphQlSchemas,
    _graphQlEnums,
    _subApps,
    _socketSubApps
  }

  return Object.assign(
    _Instance,
    CreateNewObjOf({name: 'GraphQlSchema', obj: GraphQlCreator}),
    CreateNewObjOf({name: 'SocketRouter', obj: SocketRouterCreator, dependencies: {treeify}}),
    CreateNewObjOf({name: 'SocketListener', obj: SocketListenerCreator, dependencies: {treeify}}),
    CreateNewObjOf({name: 'Router', obj: RouterCreator, dependencies: {treeify}}),
    CreateNewObjOf({name: 'Path', obj: PathCreator, dependencies: {treeify}}),
    AssignHandler({name: 'sockets', obj: _useSockets, chainLink: _Instance, override: true}),
    AssignHandler({name: 'graphql', obj: _useGraphql, chainLink: _Instance, override: true}),
    AssignHandler({name: 'describe', obj: _describe, chainLink: _Instance, override: true}),
    AssignHandler({name: 'options', obj: _options, chainLink: _Instance, override: true}),
    AssignHandler({name: 'inject', obj: _injected, chainLink: _Instance, override: true}),
    CreateObjectArray({name: 'middleware', arr: _middleWares, chainLink: _Instance}),
    CreateObjectArray({name: 'socketMiddleware', arr: _socketMiddlewares, chainLink: _Instance}),
    CreateArray({name: 'subApp', arr: _subApps, chainLink: _Instance}),
    CreateArray({name: 'enum', arr: _graphQlEnums, chainLink: _Instance}),
    CreateSwagger({swaggerObject: _useSwagger, dependencies:{yamlCreator: stringify, chainLink: _Instance, fs}}),
    PrettyPrint({httpObject: _routersObject, socketsObject: _socketRoutersObject, chainLink: _Instance, dependencies: {treeify, _useSockets, _loggerEntity, populateObjectWithTreeUtil}}),
    RegisterRouters({_graphQlSchemas, _useGraphql, _graphQlEnums, _injected, makeExecutableSchema, graphiqlExpress, graphqlExpress, bodyParser, populateRoutersUtil, _socketSubApps, _useSockets, populateSocketRoutersUtil, populateSubAppsUtil, _middleWares, _routersObject, _socketRoutersObject, _subApps, _Instance}),
    EventsCreator(EventEmitter),
    GetObjProps(_appData),
    Listen({_createHandler, _version, os, print, makeExecutableSchema, bodyParser, graphiqlExpress, graphqlExpress, _graphQlEnums, _graphQlSchemas, graphqlHandler, io, _Instance, _useGraphql, checkSubRouters, _useSockets, _socketRoutersObject, socketMiddlewareHandler, _injected, _socketMiddlewares, http, print, os, _version, socketHandler})
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
