import { GetObjProps } from '../../src/objectFactories'

describe('GetObjProps suite', ()=>{
  test('should return func named getObjProps', ()=>{
    expect(GetObjProps()).toMatchObject({getObjProps:expect.any(Function)})
  })
  test('should return obj passed to 1st func', ()=>{
    const object = {
      randomKey:'random value'
    }
    expect(GetObjProps(object)['getObjProps']()).toEqual(object)
  })
})