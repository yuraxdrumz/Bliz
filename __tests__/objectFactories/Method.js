import { Method } from '../../src/objectFactories'

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