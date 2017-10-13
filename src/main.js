import RouterCreator from './router'
import PathCreator from './path'
import { Listen, CreateArray, CreateNewObjOf } from './objectFactories'
import { urlUtil } from './utils'
import defaultHandler from './defaultHandler'
import midHandler from './middlewareHandler'
import http from 'http'
import RegisterRouters from './registerRouters'


// main instance creator, returns a func which expects an http object and creates an instance
const BlizApp = (RouterCreator, Listen, urlUtil, defaultHandler, midHandler, PathCreator, http) => {
  const Instance = {}
  const middleWares = []
  return Object.assign(
    Instance,
    CreateNewObjOf('Router', RouterCreator),
    RegisterRouters(http, Listen, urlUtil, defaultHandler, midHandler, middleWares),
    CreateArray('middleware',middleWares, Instance),
    CreateNewObjOf('Path', PathCreator)
  )
}

const BlizCreator = () => {
  return Object.assign(
    {},
    BlizApp(RouterCreator, Listen, urlUtil, defaultHandler, midHandler, PathCreator, http)
  )
}

export default BlizCreator