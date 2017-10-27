// // handler for express middlewares with next...
// async function midHandler(Promise, req, res, arr){
//   function next(resolve, reject, ...args){
//     if(args.length > 0) return reject(args[0])
//     return resolve()
//   }
//
//   for(let item of arr){
//     await new Promise((resolve, reject)=>{
//       item(req,res,next.bind(this,resolve, reject))
//     })
//   }
// }
//
// export default midHandler
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