import Bliz from './src/main'

const app = Bliz()

const PostSchema = app.createGraphQlSchema(`
    type Post{
        name: String!
        id: Int!
        data: String
    }
`).resolver({
    Query:{
        Post(obj, args, context, info){
            return {name:'asdsda', id:args.id}
        }
    },
    Post:{
        name(post, args, context, info){
            return post.name
        },
        id(post, args, context, info){
            return post.id
        },
        data(post, args, context, info){
            return post.data
        }
    }
}).query(`Post(id: Int!): Post`)


const UserSchema = app
    .createGraphQlSchema(
    `type User {
        first_name: String!
        last_name: String!
        height: Height!
        posts: [Post]
    }
    input newUser {
        first_name: String!
        last_name: String
    }
    `)
    .resolver({
        Query:{
            User(obj, args, context, info){
                return {first_name:'Yura', last_name:'Khomyakov'}
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
                return [{name:'post', id:1, data:'data'}]
            }
        },
        Mutation:{
            createUser(root, { input }, context){
                return input
            },
            deleteUser(root, args, context){
                return {first_name: args.first_name, last_name: 'whatever'}
            },
        }
    })
    .mutation(`
        createUser(input: newUser): User
        deleteUser(first_name: String!): User
    `)
    .query(`User(id: Int!): User`)

app
    .graphql({enabled: true})
    .enum(`
    AllowedColor {
        RED
        GREEN
        BLUE
    }`)
    .enum(`
    Height {
        one 
        two
        three
    }`)
    .registerGraphQlSchemas(UserSchema, PostSchema)
    .inject({
        UserModel: {}
    })
    .prettyPrint()
    .listen(4000)
