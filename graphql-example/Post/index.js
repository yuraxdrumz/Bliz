import postSchema from './schema'
import postResolver from './resolver'

export default function PostSchema (app) {
  return app
  .createGraphQlSchema(postSchema)
  .resolver(postResolver)
  .resolver({
    Subscription: (pubsub) => ({
      postAdded: {  // create a channelAdded subscription resolver function.
        subscribe: () => pubsub.asyncIterator('POST_ADDED')  // subscribe to changes in a topic
      }
    })
  })
  .query(`Post(id: Int!): Post`)
  .mutation(`Post(input: newPost): Post`)
  .subscription(`postAdded: Post`)
}
