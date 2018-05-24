import Bliz from '../src/main'


const app = Bliz()

app
.prettyPrint()
.graphql({enabled: true, allowPartialRemoteSchema: true})
.registerRemoteGraphQlSchemas('http://localhost:4000/graphql')
// .registerGraphQlSchemas(UserSchema(app), PostSchema(app))
.enum({name:'Height', options:['tall', 'short', 'average']})
.listen(5000)
