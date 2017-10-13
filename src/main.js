import RouterCreator from './router'
import PathCreator from './path'
import { Listen, CreateMiddleWare, CreateNewObjOf } from './objectFactories'
import { urlUtil } from './utils'
import defaultHandler from './defaultHandler'
import midHandler from './middlewareHandler'
import Promise from 'bluebird'
import http from 'http'
import RegisterRouters from './registerRouters'
import EventEmitter from 'events'
import Request from './request'
import Response from './response'

// main instance creator, returns a func which expects an http object and creates an instance
const BlizAppCreator = (RouterCreator, Listen, urlUtil, defaultHandler, midHandler, PathCreator, Promise, http, EventEmitter, Request, Response) => {
  const Instance = {}
  const middleWares = []
  return Object.assign(
    Instance,
    CreateNewObjOf('Router', RouterCreator),
    RegisterRouters(http, Listen, urlUtil, defaultHandler, midHandler, middleWares, Promise, EventEmitter, Request, Response),
    CreateMiddleWare(middleWares, Instance),
    CreateNewObjOf('Path', PathCreator)
  )

}

export default BlizAppCreator(RouterCreator, Listen, urlUtil, defaultHandler, midHandler, PathCreator, Promise, http, EventEmitter, Request, Response)