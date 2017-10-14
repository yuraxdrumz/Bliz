import RouterCreator from './router'
import PathCreator from './path'
import { Listen, CreateArray, CreateNewObjOf, GetObjProps } from './objectFactories'
import { urlUtil, populateRoutersUtil, handleNestedRoutersUtil, populateUrlOptions, populateSubAppsUtil } from './utils'
import defaultHandler from './defaultHandler'
import midHandler from './middlewareHandler'
import http from 'http'
import RegisterRouters from './registerRouters'
import createHandler from './handler'

// main instance creator, returns an instance of bliz app
const BlizApp = (RouterCreator, Listen, defaultHandler, midHandler, PathCreator, http, urlUtil, populateRoutersUtil, handleNestedRoutersUtil, populateUrlOptions, createHandler, GetObjProps, populateSubAppsUtil) => {
  const Instance = {}
  const middleWares = []
  const routersObject = {}
  const subApps = []
  return Object.assign(
    Instance,
    CreateNewObjOf('Router', RouterCreator),
    RegisterRouters(populateRoutersUtil, routersObject, Instance),
    CreateArray('middleware',middleWares, Instance),
    CreateArray('subApp', subApps, Instance),
    CreateNewObjOf('Path', PathCreator),
    GetObjProps({middleWares, routersObject, subApps}),
    Listen(http, createHandler.bind(this, defaultHandler, midHandler, urlUtil, handleNestedRoutersUtil, populateUrlOptions), middleWares, routersObject, subApps, populateSubAppsUtil)
  )
}

const BlizCreator = () => {
  return Object.assign(
    {},
    BlizApp(RouterCreator, Listen, defaultHandler, midHandler, PathCreator, http, urlUtil, populateRoutersUtil, handleNestedRoutersUtil, populateUrlOptions, createHandler, GetObjProps, populateSubAppsUtil)
  )
}

export default BlizCreator