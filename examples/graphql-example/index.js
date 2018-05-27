import Bliz from '../../src/main'

import PostSchema from './Post'
import UserSchema from './User'

const app = Bliz()

app
.prettyPrint()
.graphql({useGraphql: true, allowPartialRemoteSchema: true, useGraphiql: true, tracing: true})
.registerGraphQlSchemas(UserSchema(app), PostSchema(app))
.enum({name: 'Height', options: ['tall', 'short', 'average']})
.enum({name: 'Role', options: ['Admin', 'User']})
// .directive(`@hasRole(role: Role) on QUERY | FIELD`)
// .directive(`@isAuthenticated on QUERY | FIELD`)
// .directive(`@listen(max: Int!) on OBJECT | INPUT_FIELD_DEFINITION | FIELD_DEFINITION`)
.directive(`@rest on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | OBJECT | INPUT_OBJECT`)
.listen(4000)
