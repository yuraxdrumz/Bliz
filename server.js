import bliz from './src/main'
import Joi from 'joi'
import bodyParser from 'body-parser'
const app = bliz()
const app2 = bliz()
const getDataValidationSchema = Joi.object().keys({
  data: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  bookName: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  dd: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
})

const getData = app
  .createPath('/:data')
  .handler((req,res)=>res.json({params:req.params,query:req.query,body:req.body}))
  .validationSchema({name:'params',schema:getDataValidationSchema})
  .validationSchema({name:'query',schema:getDataValidationSchema})
  .validationSchema({name:'body',schema:getDataValidationSchema})
  // .validationSchema({name:'headers',schema:getDataValidationSchema})

const getData2 = app2
  .createPath('/:datdsaa')
  .handler((req,res)=>res.json({params:req.params,query:req.query,body:req.body}))

const slashRouter2 = app2
  .createRouter('/dsaasd/ddd')
  .get(getData2)
  .post(getData2)
  .middleware(bodyParser.json())

const slashRouter = app
  .createRouter('/d/d/a')
  .get(getData)
  .post(getData)
  .middleware(bodyParser.json())
app2.registerRouters(slashRouter2)
app.subApp(app2).registerRouters(slashRouter).listen(3000,()=>console.log('listening on bliz server on port 3000'))
