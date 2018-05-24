import Bliz from '../src/main'
import PostSchema from './Post'
import UserSchema from './User'

const app = Bliz()

app
.prettyPrint()
.graphql({useGraphql: true, allowPartialRemoteSchema: true})
.registerGraphQlSchemas(UserSchema(app), PostSchema(app))
.enum({name:'Height', options:['tall', 'short', 'average']})
.listen(4000)
