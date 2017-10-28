import { PrettyPrint } from '../../src/objectFactories'


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