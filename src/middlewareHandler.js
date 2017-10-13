// handler for express middlewares with next...
async function midHandler(Promise, req, res, arr){
  function next(resolve, reject, ...args){
    if(args.length > 0) return reject(args[0])
    return resolve()
  }
  for(let item of arr){
    await new Promise((resolve, reject)=>{
      item(req,res,next.bind(this,resolve, reject))
    })
  }
}

export default midHandler