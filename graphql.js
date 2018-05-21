import Bliz from './src/main'
import { makeExecutableSchema } from 'graphql-tools'


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
        posts: [Post]
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
    const resolvers = {
        Query: {
          posts() {
            return posts;
          },
        },
        Mutation: {
          upvotePost(_, { postId }) {
            const post = find(posts, { id: postId });
            if (!post) {
              throw new Error(`Couldn't find post with id ${postId}`);
            }
            post.votes += 1;
            return post;
          },
        },
        Author: {
          posts(author) {
            return filter(posts, { authorId: author.id });
          },
        },
        Post: {
          author(post) {
            return find(authors, { id: post.authorId });
          },
        },
      };

const executableSchema = makeExecutableSchema({
    typeDefs: `
    type Author {
      id: ID! # the ! means that every author object _must_ have an id
      firstName: String
      lastName: String
      """
      the list of Posts by this author
      """
      posts: [Post]
    }
    
    type Post {
      id: ID!
      title: String
      author: Author
      votes: Int
    }
    
    # the schema allows the following query:
    type Query {
      posts: [Post]
    }
    
    # this schema allows the following mutation:
    type Mutation {
      upvotePost (
        postId: ID!
      ): Post
    }
    
    # we need to tell the server which types represent the root query
    # and root mutation types. We call them RootQuery and RootMutation by convention.
    schema {
      query: Query
      mutation: Mutation
    }
    `,
    resolvers
});

app
    .graphql({enabled: true, executableSchema, resolvers})
    .registerGraphQlSchemas(UserSchema, PostSchema)
    .prettyPrint()
    .listen(4000)
