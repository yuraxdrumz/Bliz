import bliz from './src/main'
import Joi from 'joi'
import bodyParser from 'body-parser'
const app = bliz()

const getDataValidationSchema = Joi.object().keys({
  data: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  bookName: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  dd: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
})

const getData = app
  .createPath('/:data')
  .handler((req,res)=>res.json({params:req.params,query:req.query,body:req.body}))
  .validationSchema(getDataValidationSchema)

const slashRouter = app
  .createRouter('/')
  .get(getData)
  .middleware(bodyParser.json())

app.registerRouters(slashRouter).listen(3000,()=>console.log('listening on bliz server on port 3000'))
