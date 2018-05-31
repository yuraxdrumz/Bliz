import Bliz, { SchemaDirectiveVisitor, defaultFieldResolver } from '../../src/main'

import PostSchema from './Post'
import UserSchema from './User'
import directiveResolvers from './directives'
const app = Bliz()

const auth = (root, args, context, info) => {
    if(!context.headers.jwt){
        throw new Error('not authorized!')
    }
}
const firstNameValidator = (root, args, context, info) => {
    throw new Error('not valid first name')
}

app
.prettyPrint()
.graphql({useGraphql: true, allowPartialRemoteSchema: true, useGraphiql: true, tracing: true})
.registerGraphQlSchemas(UserSchema(app), PostSchema(app))
.enum({name: 'Height', options: ['tall', 'short', 'average']})
.enum({name: 'Role', options: ['Admin', 'User']})
.directive({name: 'custom', fn: auth})
.directive({name: 'firstNameValidator', fn: firstNameValidator})
.listen(4001)
