import RouterCreator from './http/router'
import SocketRouterCreator from './sockets/socketRouter'
import SocketListenerCreator from './sockets/socketListener'
import packgeJson from '../package.json'
import PathCreator from './http/path'
import GraphQlCreator from './graphql/graphQlSchema'
import socketHandler from './sockets/socketHandler'
import { graphqlExpress, graphiqlExpress } from './apolloServer/main'
import { makeExecutableSchema } from 'graphql-tools'
import bodyParser from 'body-parser'

import { 
  Listen,
  CreateArray,
  CreateNewObjOf,
  GetObjProps,
  PrettyPrint,
  EventsCreator,
  AssignHandler,
  CreateSwagger,
  CreateObjectArray
 } from './objectFactories'

import { 
  urlUtil,
  populateQueryUtil,
  populateRoutersUtil,
  populateParamsUtil,
  handleNestedRoutersUtil,
  populateUrlOptions,
  populateSubAppsUtil,
  populateSocketRoutersUtil,
  populateObjectWithTreeUtil,
  checkSubRouters
 } from './utils'

import defaultHandler from './http/defaultHandler'
import midHandler, { socketMiddlewareHandler } from './middlewareHandler'
import http from 'http'
import RegisterRouters from './registerRouters'
import CreateHandler from './http/handler'
import request from './http/request'
import response from './http/response'
import fs from 'fs'
import treeify from 'treeify'
import { struct, superstruct, StructError } from 'superstruct'
import EventEmitter from 'eventemitter2'
import Promise from 'bluebird'
import { stringify } from 'json-to-pretty-yaml'
import print from 'print-message'
import os from 'os'

const superStructObject = {
  struct,
  superstruct,
  StructError
}

const BlizAppParams = {
  request, 
  response, 
  socketMiddlewareHandler,
  populateSocketRoutersUtil,
  superStructObject, 
  RouterCreator, 
  os,
  CreateObjectArray,
  Listen, 
  graphiqlExpress,
  graphqlExpress,
  bodyParser,
  socketHandler,
  checkSubRouters,
  defaultHandler, 
  midHandler, 
  makeExecutableSchema,
  SocketRouterCreator,
  SocketListenerCreator,
  PathCreator, 
  packgeJson,
  GraphQlCreator,
  http, 
  print,
  populateObjectWithTreeUtil,
  urlUtil, 
  populateRoutersUtil, 
  handleNestedRoutersUtil,
  populateParamsUtil, 
  populateQueryUtil, 
  populateUrlOptions, 
  CreateHandler, 
  GetObjProps, 
  populateSubAppsUtil, 
  treeify, 
  EventsCreator, 
  EventEmitter, 
  Promise, 
  CreateSwagger, 
  stringify, 
  fs
}

// main instance creator, returns an instance of bliz app
const BlizApp = (BlizAppParams) => {
  const {
    request, 
    response, 
    superStructObject, 
    socketMiddlewareHandler,
    RouterCreator, 
    packgeJson,
    Listen, 
    print,
    defaultHandler, 
    midHandler, 
    PathCreator, 
    os,
    GraphQlCreator,
    graphiqlExpress,
    graphqlExpress,
    bodyParser,
    SocketListenerCreator,
    http, 
    socketHandler,
    CreateObjectArray,
    urlUtil, 
    makeExecutableSchema,
    SocketRouterCreator,
    populateObjectWithTreeUtil,
    populateRoutersUtil, 
    handleNestedRoutersUtil,
    populateParamsUtil, 
    populateQueryUtil, 
    populateUrlOptions, 
    populateSocketRoutersUtil,
    CreateHandler, 
    GetObjProps, 
    populateSubAppsUtil, 
    treeify, 
    checkSubRouters,
    EventsCreator, 
    EventEmitter, 
    Promise, 
    CreateSwagger, 
    stringify, 
    fs
  } = BlizAppParams

  const _version = packgeJson.version
  const _Instance = {}
  const _loggerEntity = {sockets: {}, http: {}}
  const _middleWares = []
  const _socketMiddlewares = []
  const _routersObject = {}
  const _socketRoutersObject = {}
  const _injected = {}
  const _useSockets = {enabled: false, delimiter: ':'}
  const _useGraphql = {enabled: false, _addedGraphRoute: false, graphqlRoute:'/graphql', graphiqlRoute: '/graphiql'}
  const _useSwagger = {enabled: false}
  const _options = {}
  const _describe = {}
  const _graphQlSchemas = {}
  const _createHandler = CreateHandler.bind(this, { request, response ,defaultHandler, midHandler, superStructObject, urlUtil, handleNestedRoutersUtil, populateParamsUtil, populateQueryUtil, populateUrlOptions, _middleWares, _routersObject, _injected, _Instance, Promise, _useSwagger })
  const _subApps = []
  const _socketSubAps = []

  return Object.assign(
    _Instance,
    CreateNewObjOf('GraphQlSchema', GraphQlCreator),
    CreateNewObjOf('SocketRouter', SocketRouterCreator, treeify),
    CreateNewObjOf('SocketListener', SocketListenerCreator, treeify),
    CreateNewObjOf('Router', RouterCreator, treeify),
    CreateNewObjOf('Path', PathCreator, treeify),
    AssignHandler('sockets', _useSockets, _Instance, true),
    AssignHandler('graphql', _useGraphql, _Instance, true),
    AssignHandler('describe', _describe, _Instance, true),
    AssignHandler('options', _options, _Instance, true),
    AssignHandler('inject', _injected, _Instance, true),
    CreateObjectArray('middleware',_middleWares, _Instance),
    CreateObjectArray('socketMiddleware', _socketMiddlewares, _Instance),
    CreateArray('subApp', _subApps, _Instance),
    CreateSwagger(stringify, _Instance, fs, _useSwagger),
    PrettyPrint(treeify, _graphQlSchemas, _routersObject, _socketRoutersObject, _Instance, _useSockets, _loggerEntity, populateObjectWithTreeUtil),
    RegisterRouters({_graphQlSchemas, _injected, makeExecutableSchema, graphiqlExpress, graphqlExpress, bodyParser, _useGraphql, populateRoutersUtil, _socketSubAps, _useSockets, populateSocketRoutersUtil, populateSubAppsUtil, _middleWares, _routersObject, _socketRoutersObject, _subApps, _Instance}),
    EventsCreator(EventEmitter),
    GetObjProps({_middleWares, _routersObject, _loggerEntity, _subApps, _injected, _options, _describe, _useSockets, _socketRoutersObject, _socketMiddlewares, _version}),
    Listen({_createHandler, _Instance, _useGraphql, checkSubRouters, _useSockets, _socketRoutersObject, socketMiddlewareHandler, _injected, _socketMiddlewares, http, print, os, _version, socketHandler})
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
