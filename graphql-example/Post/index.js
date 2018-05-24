import postSchema from './schema'
import postResolver from './resolver'

export default function PostSchema (app) {
  return app
  .createGraphQlSchema(postSchema)
  .resolver(postResolver)
  .resolver({
    Subscription:(pubsub)=> ({
      postAdded: {
        subscribe:()=>{
          return pubsub.asyncIterator('POST_ADDED')
        }
      }
    })
  })
  .query(`Post(id: Int!): Post`)
  .mutation(`Post(input: newPost): Post`)
  .subscription(`postAdded: Post`)
}
