import Bliz from '../src/main'
import PostSchema from './Post'
import UserSchema from './User'

const app = Bliz()

const directiveResolvers = {
  hasRole: (next, source, { role }, ctx) => {
    if (role === source.role) return next()
    throw new Error(`Must have role: ${role}, you have role: ${source.role}`)
  }
}

app
.prettyPrint()
.graphql({useGraphql: true, allowPartialRemoteSchema: true, useGraphiql: true, directiveResolvers, tracing: true})
.registerGraphQlSchemas(UserSchema(app), PostSchema(app))
.enum({name: 'Height', options: ['tall', 'short', 'average']})
.enum({name: 'Role', options: ['Admin', 'User']})
.directive(`@isAuthenticated on QUERY | FIELD`)
.directive(`@hasRole(role: Role) on QUERY | FIELD`)
.listen(4000)
