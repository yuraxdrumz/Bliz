import Bliz, { struct, superstruct } from './src/main'
import path from 'path'
import io from 'socket.io'

const app = Bliz()


const PostSchema = app.createGraphQlSchema(`
    type Post{
        name: String!
        id: Int!
        data: String
    }
`).resolver({
    Query:{
        post(obj, args, context, info){
            return find(post, {id:args.id})
        }
    },
    Post:{
        name(post){
            return post.name
        },
        id(post){
            return post.id
        },
        data(post){
            return post.data
        }
    }
}).query(`Post(id: Int!): Post`)


const UserSchema = app
    .createGraphQlSchema(
    `type User {
        first_name: String!
        last_name: String!
        posts: [Posts]
    }
    type newUser {
        first_name: String!
        last_name: String
    }
    `)
    .resolver({
        Query:{
            user(obj, args, context, info){
                return context.User.find(users, {id:args.id})
            }
        },
        User:{
            first_name(user, args, context, info){
                return user.first_name
            },
            last_name(user, args, context, info){
                return user.last_name
            },
            posts(user, args, context, info){
                return context.Post.find({id:user.id})
            }
        },
        Mutation:{
            createUser(root, { input }, context){
                return input
            }
        }
    })
    .mutation(`createUser(input: newUser): User`)
    .query(`User(id: Int!): User`)

app
    .registerGraphQlSchemas(UserSchema)
    .listen(4000)
