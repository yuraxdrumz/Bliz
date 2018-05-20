
const next = (resolve, reject, ...args) => {
  if(args.length > 0) return reject(args[0])
  return resolve()
}

const promiseTimeout = (promise, ms, throwError) => {

  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      const err = new Error('Timed out in '+ ms + 'ms.')
      throwError ? reject(err) : resolve('Timed out in '+ ms + 'ms.')
    }, ms)
  })

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ])
}

// handler for express middlewares with next...
async function midHandler(Promise, req, res, arr){
  for(let item of arr){
    const { fn, timeout, throwError } = item
    const handlerPromise = new Promise((resolve, reject) => fn(req, res, next.bind(this, resolve, reject)))   
    await promiseTimeout(handlerPromise, timeout, throwError)
  }
}

async function socketMiddlewareHandler(Promise, io, socket, msg, cb, arr){
  // run on middleware array and wait for each sequentially
  for(let item of arr){
    const { fn, timeout, throwError } = item
    const handlerPromise = new Promise((resolve, reject) => fn(io, socket, msg, cb, next.bind(this, resolve, reject)))  
    await promiseTimeout(handlerPromise, timeout, throwError)
  }
}

export { socketMiddlewareHandler }
export default midHandler
