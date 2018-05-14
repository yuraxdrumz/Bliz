// default error handler handler
import { StructError } from './main'
const defaultErrorHandler = function(req ,res, err){
  if(err){
    res.statusCode = err.status || 500
    if(err instanceof StructError){
      res.json({error:err.message, path: err.path, dataPassed:err.data, valueReceived:err.value, typeExpected:err.type})
    } else {
      res.json({error:err.message})
    }

  }else{
    res.statusCode = 404
    res.json({error:`${req.method.toUpperCase()} - ${req.url} not found...`})
  }
}
export default defaultErrorHandler