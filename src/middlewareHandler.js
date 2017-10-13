// handler for express middlewares with next...
function midHandler(Promise, req, res, arr){
  function next(resolve, reject, ...args){
    if(args.length > 0) return reject(args[0])
    return resolve()
  }
  return Promise.mapSeries(arr, item=>{
    return new Promise((resolve, reject)=>{
      item(req,res,next.bind(this,resolve, reject))
    })
  })
}

export default midHandler