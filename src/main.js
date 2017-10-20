import RouterCreator from './router'
import PathCreator from './path'
import { Listen, CreateArray, CreateNewObjOf, GetObjProps, PrettyPrint } from './objectFactories'
import { urlUtil, populateRoutersUtil, handleNestedRoutersUtil, populateUrlOptions, populateSubAppsUtil } from './utils'
import defaultHandler from './defaultHandler'
import midHandler from './middlewareHandler'
import http from 'http'
import RegisterRouters from './registerRouters'
import createHandler from './handler'
import request from './request'
import response from './response'
import treeify from 'treeify'
import Joi from 'joi'
// main instance creator, returns an instance of bliz app
const BlizApp = (request, response, Joi, RouterCreator, Listen, defaultHandler, midHandler, PathCreator, http, urlUtil, populateRoutersUtil, handleNestedRoutersUtil, populateUrlOptions, createHandler, GetObjProps, populateSubAppsUtil, treeify) => {
  const Instance = {}
  const middleWares = []
  const routersObject = {}
  const subApps = []
  return Object.assign(
    Instance,
    PrettyPrint(treeify, routersObject, Instance),
    CreateNewObjOf('Router', RouterCreator, treeify),
    RegisterRouters(populateRoutersUtil, populateSubAppsUtil, middleWares, routersObject, subApps, Instance),
    CreateArray('middleware',middleWares, Instance),
    CreateArray('subApp', subApps, Instance),
    CreateNewObjOf('Path', PathCreator, treeify),
    GetObjProps({middleWares, routersObject, subApps}),
    Listen(http, createHandler.bind(this,request, response ,defaultHandler, midHandler, Joi, urlUtil, handleNestedRoutersUtil, populateUrlOptions), middleWares, routersObject, subApps, populateSubAppsUtil)
  )
}

const BlizCreator = () => {
  return Object.assign(
    {},
    BlizApp(request, response,Joi, RouterCreator, Listen, defaultHandler, midHandler, PathCreator, http, urlUtil, populateRoutersUtil, handleNestedRoutersUtil, populateUrlOptions, createHandler, GetObjProps, populateSubAppsUtil, treeify)
  )
}

export default BlizCreator
export { request, response, Joi }