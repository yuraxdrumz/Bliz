import Bliz from '../src/main'
import PostSchema from './Post'
import UserSchema from './User'

const app = Bliz()

app
.prettyPrint()
.graphql({enabled: true, allowPartialRemoteSchema: true})
.registerRemoteGraphQlSchemas('http://localhost:8082/graphql', 'http://localhost:8083/graphql')
// .registerGraphQlSchemas(UserSchema(app), PostSchema(app))
.enum({name:'Height', options:['tall', 'short', 'average']})
.listen(4000)
