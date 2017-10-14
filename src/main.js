import RouterCreator from './router'
import PathCreator from './path'
import { Listen, CreateArray, CreateNewObjOf, GetObjProps } from './objectFactories'
import { urlUtil, populateRoutersUtil, handleNestedRoutersUtil, populateUrlOptions } from './utils'
import defaultHandler from './defaultHandler'
import midHandler from './middlewareHandler'
import http from 'http'
import RegisterRouters from './registerRouters'
import createHandler from './handler'

// main instance creator, returns a func which expects an http object and creates an instance
const BlizApp = (RouterCreator, Listen, defaultHandler, midHandler, PathCreator, http, urlUtil, populateRoutersUtil, handleNestedRoutersUtil, populateUrlOptions, createHandler, GetObjProps) => {
  const Instance = {}
  const middleWares = []
  const routersObject = {}
  return Object.assign(
    Instance,
    CreateNewObjOf('Router', RouterCreator),
    RegisterRouters(populateRoutersUtil, routersObject, Instance),
    CreateArray('middleware',middleWares, Instance),
    CreateNewObjOf('Path', PathCreator),
    GetObjProps({middleWares, routersObject}),
    Listen(http, createHandler.bind(this, defaultHandler, midHandler, middleWares, urlUtil, handleNestedRoutersUtil, populateUrlOptions), routersObject)
  )
}

const BlizCreator = () => {
  return Object.assign(
    {},
    BlizApp(RouterCreator, Listen, defaultHandler, midHandler, PathCreator, http, urlUtil, populateRoutersUtil, handleNestedRoutersUtil, populateUrlOptions, createHandler, GetObjProps)
  )
}

export default BlizCreator