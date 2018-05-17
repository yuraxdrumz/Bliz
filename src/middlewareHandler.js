// handler for express middlewares with next...
async function midHandler(Promise, req, res, arr){
  // next function to be injected in  middlewares with resolve nad reject of promise
  function next(resolve, reject, ...args){
    if(args.length > 0) return reject(args[0])
    return resolve()
  }
  // run on middleware array and wait for each sequentially
  for(let item of arr){
    await new Promise((resolve, reject)=>{
      item(req,res,next.bind(this,resolve, reject))
    })
  }
}

async function socketMiddlewareHandler(Promise, io, socket, msg, cb, arr){
 
  // next function to be injected in  middlewares with resolve nad reject of promise
  function next(resolve, reject, ...args){
    if(args.length > 0) return reject(args[0])
    return resolve()
  }
  // run on middleware array and wait for each sequentially
  for(let item of arr){
    const { fn, timeout, throwError } = item
    await new Promise((resolve, reject) => {
      fn(io, socket, msg, cb,next.bind(this, resolve, reject))
      setTimeout(()=>throwError ? reject(`timeout of ${timeout}ms has passed...`) : resolve(`timeout of ${timeout}ms has passed...`), timeout)
    })
  }
}

export { socketMiddlewareHandler }
export default midHandler
