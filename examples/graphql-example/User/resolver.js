const resolver = {
  Query:{
      User(obj, args, context, info){
          return {first_name:'Yura', last_name:'Khomyakov', height: "tall", role: 'Admin'}
      }
  },
  User:{
      first_name(user, args, context, info){
          return user.first_name
      },
      last_name(user, args, context, info){
          return user.last_name
      },
      role(user){
          return user.role
      },
      posts(user, args, context, info){
          return [{name:'post', id:1, data:'data'}]
      }
  },
  Mutation:(pubsub)=>({
      createUser(root, args, context){
          return args.input
      },
      deleteUser(root, args, context){
          return {first_name: args.first_name, last_name: 'whatever'}
      },
  })
}

export default resolver
