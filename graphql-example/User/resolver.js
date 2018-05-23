const resolver = {
  Query:{
      User(obj, args, context, info){
          return {first_name:'Yura', last_name:'Khomyakov', height:11}
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
  Mutation: (pubsub) => ({
      createUser(root, { input }, context){
          return input
      },
      deleteUser(root, args, context){
          return {first_name: args.first_name, last_name: 'whatever'}
      },
  })
}

export default resolver
