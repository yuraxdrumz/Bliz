const defaultHandler = function(req ,res, err){
  if(err){
    res.statusCode = err.status || 500
    res.json({error:err.toString()})

  }else{
    res.statusCode = 404
    res.json({error:`url:${req.url} not found...`})
  }
}

export default defaultHandler