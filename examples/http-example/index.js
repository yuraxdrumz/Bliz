import Bliz from '../../src/main'
import bodyParser from 'body-parser'
import path from 'path'
import slashRouter from './slash.router'

const app = Bliz()

app
  .registerRouters(slashRouter(app))
  .prettyPrint()
  .describe({
    title:'my api', 
    version:'1.0.1', 
    description:'some random api', 
    contact:{name:'me', email:'yuri.khomyakov@ironsrc.com', url:'asddsasad'},
    license:{
      name: 'MIT',
      url:'dsadsa'
    },
    servers:[{url:'sadadsadads', description:'asdadsdssdaasd'}]
  })
  .swagger({useSwagger: true,absoluteFilePath: path.resolve('./swagger.yaml')})
  .middleware(bodyParser.json())
  .listen(4000)
