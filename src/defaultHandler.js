const defaultHandler = function(req ,res, ...errs){
  res.writeHead(404)
  res.write('default handler...')
  if(errs.length > 0){
    errs.map(err=>{
      res.write(err.toString())
      res.write('\n')
    })
  }else{
    res.write(`url:${req.url} not found...`)
  }
  res.end()
}

export default defaultHandler