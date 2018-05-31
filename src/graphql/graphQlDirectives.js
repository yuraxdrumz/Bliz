const createDirective = (SchemaDirectiveVisitor, defaultFieldResolver) => (fn) => {
  return class extends SchemaDirectiveVisitor {
    visitArgumentDefinition(field, object) {
      this.handler(object.field)
    }
    visitFieldDefinition(field) {
      this.handler(field)
    }
    visitEnum(type) {
      this.handler(type)
    }
    visitObject(type) {
      const fields = type.getFields()
      const fieldKeys = Object.keys(fields)
      for (let key of fieldKeys) {
        this.handler(fields[key])
      }
    }
    visitInputObject(type) {
      const fields = type.getFields()
      const fieldKeys = Object.keys(fields)
      for (let key of fieldKeys) {
        this.handler(fields[key])
      }
    }
    visitEnumValue(value) {
      this.handler(value)
    }
    visitInputFieldDefinition(field) {
      this.handler(field)
    }
    handler(field, details) {
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function(source, args, context, info) {
        fn(source, args, context, info)
        resolve(source, args, context, info)
      }
    }
  }
}

export { createDirective }
