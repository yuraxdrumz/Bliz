import Bliz from '../src/main'

const app = Bliz()

app
.prettyPrint()
.graphql({useGraphql: true, allowPartialRemoteSchema: true, useGraphiql: false})
.registerRemoteGraphQlSchemas({url:'http://localhost:4000/graphql', ws: 'ws://localhost:4000/subscriptions'}, {url:'http://localhost:6000/graphql', ws: 'ws://localhost:6000/subscriptions'})
.enum({name:'Height', options: ['tall', 'short', 'average']})
.listen(5000)
