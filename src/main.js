import RouterCreator from './router'
import PathCreator from './path'
import { Listen, CreateArray, CreateNewObjOf, GetObjProps, PrettyPrint, EventsCreator, AssignHandler } from './objectFactories'
import { urlUtil, populateQueryUtil,populateRoutersUtil,populateParamsUtil, handleNestedRoutersUtil, populateUrlOptions, populateSubAppsUtil } from './utils'
import defaultHandler from './defaultHandler'
import midHandler from './middlewareHandler'
import http from 'http'
import RegisterRouters from './registerRouters'
import CreateHandler from './handler'
import request from './request'
import response from './response'
import treeify from 'treeify'
import { struct, superstruct } from 'superstruct'
import EventEmitter from 'eventemitter2'
import Promise from 'bluebird'

// main instance creator, returns an instance of bliz app
const BlizApp = (request, response, { struct, superstruct }, RouterCreator, Listen, defaultHandler, midHandler, PathCreator, http, urlUtil, populateRoutersUtil, handleNestedRoutersUtil,populateParamsUtil, populateQueryUtil, populateUrlOptions, createHandler, GetObjProps, populateSubAppsUtil, treeify, EventsCreator, EventEmitter, Promise) => {
  const _Instance = {}
  const _middleWares = []
  const _routersObject = {}
  const _injected = {}
  const _createHandler = CreateHandler.bind(this,request, response ,defaultHandler, midHandler, { struct, superstruct }, urlUtil, handleNestedRoutersUtil,populateParamsUtil, populateQueryUtil, populateUrlOptions, _middleWares, _routersObject, _injected, _Instance, Promise)
  const _subApps = []
  return Object.assign(
    _Instance,
    AssignHandler('inject', _injected, _Instance, true),
    PrettyPrint(treeify, _routersObject, _Instance),
    CreateNewObjOf('Router', RouterCreator, treeify),
    RegisterRouters(populateRoutersUtil, populateSubAppsUtil, _middleWares, _routersObject, _subApps, _Instance),
    CreateArray('middleware',_middleWares, _Instance),
    CreateArray('subApp', _subApps, _Instance),
    CreateNewObjOf('Path', PathCreator, treeify),
    EventsCreator(EventEmitter),
    GetObjProps({_middleWares, _routersObject, _subApps, _injected}),
    Listen('listen', _createHandler, http)
  )
}

const BlizCreator = () => {
  return Object.assign(
    {},
    BlizApp(
      request,
      response,
      { struct, superstruct },
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
      Promise
    )
  )
}

export default BlizCreator
export { request, response, struct, superstruct }