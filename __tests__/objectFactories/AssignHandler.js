import { AssignHandler } from '../../src/objectFactories'

describe('AssignHandler suite', ()=>{
  test('should return object with method name as 1st param passed', ()=>{
    const name = 'random name'
    expect(AssignHandler(name)).toMatchObject({[name]:expect.any(Function)})
  })
  test('should put a key on object same as name and data passed to 2nd func as value', ()=>{
    const name = 'random name'
    const object = {}
    const chainLink = {}
    const data = {blabla:'blabla'}
    expect(AssignHandler(name)).toMatchObject({[name]:expect.any(Function)})
    expect(AssignHandler(name, object, chainLink)[name](data)).toEqual(chainLink)
    expect(object).toHaveProperty(name)
    expect(object[name]).toEqual(data)
  })
})