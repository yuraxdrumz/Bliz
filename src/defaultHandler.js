let defaultHandler = function(req ,res, err){
  if(err){
    res.statusCode = err.status || 500
    res.json({error:err.toString()})

  }else{
    res.statusCode = 404
    res.json({error:`${req.method.toUpperCase()} - ${req.url} not found...`})
  }
}
export default defaultHandler