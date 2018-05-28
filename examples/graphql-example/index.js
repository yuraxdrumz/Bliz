import Bliz, { SchemaDirectiveVisitor, defaultFieldResolver } from '../../src/main'

import PostSchema from './Post'
import UserSchema from './User'
import directiveResolvers from './directives'
const app = Bliz()

app
.prettyPrint()
.graphql({useGraphql: true, allowPartialRemoteSchema: true, directiveResolvers: directiveResolvers(SchemaDirectiveVisitor, defaultFieldResolver), useGraphiql: true, tracing: true})
.registerGraphQlSchemas(UserSchema(app), PostSchema(app))
.enum({name: 'Height', options: ['tall', 'short', 'average']})
.enum({name: 'Role', options: ['Admin', 'User']})
.listen(4000)
