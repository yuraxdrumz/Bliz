import RouterCreator from './router'
import SocketRouterCreator from './socketRouter' 
import SocketListenerCreator from './socketListener'
import PathCreator from './path'
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
  populateSocketRoutersUtil
 } from './utils'
 
import defaultHandler from './defaultHandler'
import midHandler, { socketMiddlewareHandler } from './middlewareHandler'
import http from 'http'
import RegisterRouters from './registerRouters'
import CreateHandler from './handler'
import request from './request'
import response from './response'
import fs from 'fs'
import treeify from 'treeify'
import { struct, superstruct, StructError } from 'superstruct'
import EventEmitter from 'eventemitter2'
import Promise from 'bluebird'
import { stringify } from 'json-to-pretty-yaml'

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
  CreateObjectArray,
  Listen, 
  defaultHandler, 
  midHandler, 
  PathCreator, 
  http, 
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
    Listen, 
    defaultHandler, 
    midHandler, 
    PathCreator, 
    http, 
    CreateObjectArray,
    urlUtil, 
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
    EventsCreator, 
    EventEmitter, 
    Promise, 
    CreateSwagger, 
    stringify, 
    fs
  } = BlizAppParams
  const _Instance = {}
  const _middleWares = []
  const _socketMiddlewares = []
  const _routersObject = {}
  const _socketRoutersObject = {}
  const _injected = {}
  const _useSockets = {enabled: false, delimiter: ':'}
  const _options = {}
  const _describe = {}
  const _createHandler = CreateHandler.bind(this, { request, response ,defaultHandler, midHandler, superStructObject, urlUtil, handleNestedRoutersUtil, populateParamsUtil, populateQueryUtil, populateUrlOptions, _middleWares, _routersObject, _injected, _Instance, Promise})
  const _subApps = []
  return Object.assign(
    _Instance,
    CreateNewObjOf('SocketRouter', SocketRouterCreator, treeify),
    CreateNewObjOf('SocketListener', SocketListenerCreator, treeify),
    CreateNewObjOf('Router', RouterCreator, treeify),
    CreateNewObjOf('Path', PathCreator, treeify),
    AssignHandler('sockets', _useSockets, _Instance, true),
    AssignHandler('describe', _describe, _Instance, true),
    AssignHandler('options', _options, _Instance, true),
    AssignHandler('inject', _injected, _Instance, true),
    CreateObjectArray('middleware',_middleWares, _Instance),
    CreateObjectArray('socketMiddleware', _socketMiddlewares, _Instance),
    CreateArray('subApp', _subApps, _Instance),
    CreateSwagger(stringify, _Instance, fs),
    PrettyPrint(treeify, _routersObject, _socketRoutersObject, _Instance),
    RegisterRouters({populateRoutersUtil, _useSockets, populateSocketRoutersUtil, populateSubAppsUtil, _middleWares, _routersObject, _socketRoutersObject, _subApps, _Instance}),
    EventsCreator(EventEmitter),
    GetObjProps({_middleWares, _routersObject, _subApps, _injected, _options, _describe, _useSockets, _socketRoutersObject, _socketMiddlewares}),
    Listen({_createHandler, _useSockets, http, _socketRoutersObject, socketMiddlewareHandler, _injected, _socketMiddlewares})
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