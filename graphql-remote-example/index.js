import Bliz from '../src/main'

const app = Bliz()

app
.prettyPrint()
.graphql({useGraphql: true, allowPartialRemoteSchema: false})
.registerRemoteGraphQlSchemas('http://localhost:4000/graphql')
.enum({name:'Height', options: ['tall', 'short', 'average']})
.listen(5000)
