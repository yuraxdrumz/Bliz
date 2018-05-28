const directiveResolvers = (SchemaDirectiveVisitor, defaultFieldResolver) => ({
  auth: class extends SchemaDirectiveVisitor {
    visitInputFieldDefinition (field, details) {
      console.log(field)
      this.handleAuth(field, details)
    }     
    visitFieldDefinition (field, details) {
      this.handleAuth(field, details)
    }
    visitObject(type){
      const fields = type.getFields()
      const fieldKeys = Object.keys(fields)
      for(let key of fieldKeys){
        this.handleAuth(fields[key])
      }
    }
    visitInputObject(type){
      const fields = type.getFields()
      const fieldKeys = Object.keys(fields)
      for(let key of fieldKeys){
        this.handleAuth(fields[key])
      }
    }
    visitArgumentDefinition(field, object){
      this.handleAuth(object.field)
    }
    handleAuth(field, details){
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function (
        source,
        args,
        context,
        info
      ) {
        if(!context.headers.jwt){
          throw new Error('Authorization Bearer required')
        } else {
          // decode jwt and put on context as user
          return resolve.apply(this, args);
        }
      };
    }
  },
  match:class extends SchemaDirectiveVisitor {
    visitArgumentDefinition(field, object){
      this.handleAuth(object.field, this.args)
    }
    handleAuth(field, directiveArgs){
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function (
        source,
        args,
        context,
        info
      ) {
        if(args.first_name !== directiveArgs.name){
          throw new Error('Invalid first_name')
        } else {
          return resolve(source, args, context, info)
        }
        
      };
    }
  },
  validateNewUser:class extends SchemaDirectiveVisitor {
    visitArgumentDefinition(field, object){
      this.handleAuth(object.field)
    }
    handleAuth(field, details){
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function (
        source,
        args,
        context,
        info
      ) {
        if(args.first_name !== 'yura'){
          throw new Error('Invalid first_name')
        } else {
          return resolve(source, args, context, info)
        }
        
      };
    }
  },
})

export default directiveResolvers