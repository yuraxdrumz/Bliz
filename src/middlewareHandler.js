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

export default midHandler