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
  .middleware((req,res,next)=>{
    console.log('hit getData1')
    next()
  })
const boom = app
  .createPath('/:data/boom')
  .handler((req,res)=>res.json({params:req.params,query:req.query,body:req.body}))
  .middleware((req,res,next)=>{
    console.log('hit boom')
    next()
  })
const boom2 = app
  .createPath('/')
  .handler((req,res)=>res.json({params:req.params,query:req.query,body:req.body}))


const getData3 = app
  .createPath('/:data/:boom/wok')
  .handler((req,res)=>res.json({params:req.params,query:req.query,body:req.body}))
  .middleware((req,res,next)=>{
  // console.log('hit getData3')
    next()
  })


const slashRouter = app
  .createRouter('/api/')
  .get(boom)
  .get(boom2)
  .post(boom)
  .get(getData)
  .get(getData3)
  // .middleware(bodyParser.json())

const slashRouter2 = app
  .createRouter('/lalala')
  .get(boom)
  .get(boom2)
  .post(boom)
  .get(getData)
  .get(getData3)
// .middleware(bodyParser.json())

app2.registerRouters(slashRouter2)

// app2.events.addListener('*',data=>console.log(`event delegated to app2: ${this.events}, data: ${data}`))
// app.events.addListener('*',data=>console.log(`event delegated to app: ${app.events.event}, data: ${data}`))

app
  .subApp(app2)
  .registerRouters(slashRouter)
  .prettyPrint()
  // .middleware(bodyParser.json())
  .listen(3000,()=>console.log('listening on bliz server on port 3000'))

