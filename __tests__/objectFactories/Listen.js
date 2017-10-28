import { Listen } from '../../src/objectFactories'

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