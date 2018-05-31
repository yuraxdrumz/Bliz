const createDirective = (SchemaDirectiveVisitor, defaultFieldResolver) => (fn) => {
  return class extends SchemaDirectiveVisitor {
    visitArgumentDefinition(field, object) {
      this.handler(object.field, this.args)
    }
    visitFieldDefinition(field) {
      this.handler(field, this.args)
    }
    visitEnum(type) {
      this.handler(type, this.args)
    }
    visitObject(type) {
      const fields = type.getFields()
      const fieldKeys = Object.keys(fields)
      for (let key of fieldKeys) {
        this.handler(fields[key], this.args)
      }
    }
    visitInputObject(type) {
      const fields = type.getFields()
      const fieldKeys = Object.keys(fields)
      for (let key of fieldKeys) {
        this.handler(fields[key], this.args)
      }
    }
    visitEnumValue(value) {
      this.handler(value, this.args)
    }
    visitInputFieldDefinition(field) {
      this.handler(field, this.args)
    }
    handler(field, directiveArgs) {
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function(source, args, context, info) {
        return fn({ directiveArgs, resolve, source, args, context, info })
      }
    }
  }
}

export { createDirective }
