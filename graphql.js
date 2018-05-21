import Bliz, { struct, superstruct } from './src/main'
import path from 'path'
import io from 'socket.io'

const app = Bliz()

const UserSchema = app
    .createGraphQlSchema(
    `type User {
        first_name: String!
        last_name: String!
    }
    type newUser {
        first_name: String!
        last_name: String
    }
    `)
    .resolver({
        User:{
            first_name(user){
                return user.first_name
            },
            last_name(user){
                return user.last_name
            }
        }
    })
    .mutation(`createUser(input: newUser): User`)
    .query(`User(id: Int!): User`)

console.log(UserSchema.getObjProps())

app
    .registerGraphQlSchemas(UserSchema)
    .listen(4000)
