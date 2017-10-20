import Bliz, { request, response, Joi } from './src/main'
import bodyParser from 'body-parser'

const app = Bliz()
const app2 = Bliz()

const getDataValidationSchema = Joi.object().keys({
  data: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  bookName: Joi.string(),
  dd: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
})

const getData = app
  .createPath('/:data/')
  .handler((req,res)=>res.json({params:req.params,query:req.query,body:req.body}))
  .validationSchema({name:'params',schema:getDataValidationSchema})

const getData2 = app2
  .createPath('/:datdsaa')
  .handler((req,res)=>res.json({params:req.params,query:req.query,body:req.body}))
  .validationSchema({name:'params',schema:getDataValidationSchema})

const slashRouter2 = app2
  .createRouter('/dsaasd/ddd')
  .get(getData2)
  .del(getData2)
  .middleware(bodyParser.json())

const slashRouter = app
  .createRouter('/api')
  .get(getData)
  .post(getData)
  .middleware(bodyParser.json())


app
  .subApp(app2.registerRouters(slashRouter2))
  .registerRouters(slashRouter)
  .prettyPrint()
  .listen(3000,()=>console.log('listening on bliz server on port 3000'))

