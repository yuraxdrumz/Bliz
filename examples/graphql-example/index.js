import Bliz from '../../src/main'

import PostSchema from './Post'
import UserSchema from './User'
const app = Bliz()

const firstNameValidator = ({ directiveArgs, resolve, source, args, context, info }) => {
    if(directiveArgs.name !== args.input.first_name){
        throw new Error('name not valid')
    } else {
        return resolve(source, args, context, info)
    }
}

app
    .prettyPrint()
    .graphql({useGraphql: true, useGraphiql: true, tracing: true})
    .registerGraphQlSchemas(UserSchema, PostSchema)
    .enum({name: 'Height', options: ['tall', 'short', 'average']})
    .enum({name: 'Role', options: ['Admin', 'User']})
    .directive({name: 'firstNameValidator', fn: firstNameValidator})
    .union({name: 'TextSearchResult', types: ['User', 'Post']})
    .interface({name: 'Car', fields: {wheels: 'String!'}})
    .inject({
        userFns:{
            findUserById: () => console.log('user from db')
        }
    })
    .listen(4001)
