
import midHandler from '../src/middlewareHandler'
describe('Middleware handler suite', ()=>{
  const fn1 = jest.fn((req,res,next)=>next())
  const fn2 = jest.fn((req,res,next)=>next())
  const fn3 = jest.fn((req,res,next)=>next())
  const req = {}
  const res = {}
  const arr = [
    fn1,
    fn2,
    fn3
  ]
  test('should iterate on functions array received and inject next to each', async ()=>{
    expect(await midHandler(Promise, req, res, arr)).not.toBeDefined()
    expect(fn1.mock.calls[0]).toMatchSnapshot()
    expect(fn2.mock.calls[0]).toMatchSnapshot()
    expect(fn3.mock.calls[0]).toMatchSnapshot()
  })
})