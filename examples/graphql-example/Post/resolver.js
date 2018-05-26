const resolver = {
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
  },
  Mutation:(pubsub)=>({
    Post(obj, args, context, info){
        pubsub.publish('POST_ADDED', {postAdded: args.input});
        return {...args.input}
    }
  })
}

export default resolver
