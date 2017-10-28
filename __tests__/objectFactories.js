import { Listen, PrettyPrint, Method } from '../src/objectFactories'

describe('Listen suite', () => {
  test('Should return object with method on it, method name should be as 1st param passed', ()=>{
    const name = 'random name'
    expect(Listen(name)).toMatchObject({[name]:expect.any(Function)})
  })
  test('Should extract handler from handlerFactory, pass it to http.createServer and return server.listen', ()=>{
    const name = 'listenName'
    const handlerFactory = jest.fn(()=>({handler:jest.fn()}))
    const listen = jest.fn((...args)=>args)
    const createServer = jest.fn((handler)=>({listen}))
    const http = {
      createServer
    }
    expect(Listen(name, handlerFactory, http)[name](3000, ()=>console.log('running on port 3000'))).toMatchSnapshot()
    expect(handlerFactory).toHaveBeenCalled()
    expect(createServer).toHaveBeenCalled()
    expect(createServer.mock.calls[0][0]).toEqual(expect.any(Function))
    expect(listen).toHaveBeenCalled()
    expect(listen.mock.calls[0]).toMatchSnapshot()

  })
})

describe('Pretty print suite', ()=>{
  test('Should return object with method named prettyPrint', ()=>{
    expect(PrettyPrint()).toMatchObject({prettyPrint:expect.any(Function)})
  })
  test('Should call logger passed to pretty print with tree of urls', ()=>{
    const treeify = {
      asTree:jest.fn((obj)=>obj)
    }
    const entry = {
      '/':{
        get:{'/test':{}},
        post:{'/postTest':{}},
        put:{'/putTest':{}},
        del:{'/delTest':{}}
      },
      '/data':{
        get:{'/dataTest':{}},
        post:{'/dataPostTest':{}},
        put:{'/dataPutTest':{}},
        del:{'/dataDelTest':{}}
      },
      '/api':{
        get:{'/apiGetTEst':{}},
        post:{'/apiPostTest':{}},
        put:{'/apiPutTest':{}},
        del:{'/apiDelTest':{}}
      },
    }
    const chainLink = {}
    const logger = jest.fn((data)=>data)
    expect(PrettyPrint(treeify, entry, chainLink)['prettyPrint'](logger)).toEqual(chainLink)
    expect(treeify.asTree.mock.calls[0]).toMatchSnapshot()
    expect(logger.mock.calls[0]).toMatchSnapshot()
  })
})

describe('Method object factory suite', ()=>{
  test('Should return object with method, method name should be as 1st param passed', ()=>{
    const name = 'blabla'
    expect(Method(name)).toMatchObject({[name]:expect.any(Function)})
  })
  test('Should add data.getObjProps.path as key and its data as value on object passed to method', ()=>{
    const name = 'blabla'
    const object = {
      [name]:{}
    }
    const chainLink = {}
    const path = 'this is random path'
    const data = {
      getObjProps:jest.fn(()=>({path}))
    }
    expect(Method(name, object, chainLink)[name](data)).toEqual(chainLink)
    expect(data.getObjProps).toHaveBeenCalled()
    expect(object).toHaveProperty(name)
    expect(object[name]).toHaveProperty(path)
    expect(object[name][path]).toEqual(data)
  })
})