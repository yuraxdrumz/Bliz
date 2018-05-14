import RouterCreator from './router'
import PathCreator from './path'
import { Listen, CreateArray, CreateNewObjOf, GetObjProps, PrettyPrint, EventsCreator, AssignHandler, CreateSwagger } from './objectFactories'
import { urlUtil, populateQueryUtil,populateRoutersUtil,populateParamsUtil, handleNestedRoutersUtil, populateUrlOptions, populateSubAppsUtil } from './utils'
import defaultHandler from './defaultHandler'
import midHandler from './middlewareHandler'
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

// main instance creator, returns an instance of bliz app
const BlizApp = (request, response, { struct, superstruct, StructError }, RouterCreator, Listen, defaultHandler, midHandler, PathCreator, http, urlUtil, populateRoutersUtil, handleNestedRoutersUtil,populateParamsUtil, populateQueryUtil, populateUrlOptions, createHandler, GetObjProps, populateSubAppsUtil, treeify, EventsCreator, EventEmitter, Promise, CreateSwagger, stringify, fs) => {
  const _Instance = {}
  const _middleWares = []
  const _routersObject = {}
  const _injected = {}
  const _options = {}
  const _describe = {}
  const _swagger = {}
  const _createHandler = CreateHandler.bind(this,request, response ,defaultHandler, midHandler, { struct, superstruct, StructError }, urlUtil, handleNestedRoutersUtil,populateParamsUtil, populateQueryUtil, populateUrlOptions, _middleWares, _routersObject, _injected, _Instance, Promise)
  const _subApps = []
  return Object.assign(
    _Instance,
    CreateSwagger(stringify, _Instance, fs),
    AssignHandler('describe', _describe, _Instance, true),
    AssignHandler('options', _options, _Instance, true),
    AssignHandler('inject', _injected, _Instance, true),
    PrettyPrint(treeify, _routersObject, _Instance),
    CreateNewObjOf('Router', RouterCreator, treeify),
    RegisterRouters(populateRoutersUtil, populateSubAppsUtil, _middleWares, _routersObject, _subApps, _Instance),
    CreateArray('middleware',_middleWares, _Instance),
    CreateArray('subApp', _subApps, _Instance),
    CreateNewObjOf('Path', PathCreator, treeify),
    EventsCreator(EventEmitter),
    GetObjProps({_middleWares, _routersObject, _subApps, _injected, _options, _describe}),
    Listen('listen', _createHandler, http, _options)
  )
}

const BlizCreator = () => {
  return Object.assign(
    {},
    BlizApp(
      request,
      response,
      { struct, superstruct, StructError },
      RouterCreator,
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
    )
  )
}

export default BlizCreator
export { request, response, struct, superstruct, StructError }