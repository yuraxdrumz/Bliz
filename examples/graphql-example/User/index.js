import userSchema from './schema'
import userResolver from './resolver'

export default function UserSchema (app) {
  return app.createGraphQlSchema(userSchema)
  .resolver(userResolver)
  .mutation(`createUser(input: newUser @firstNameValidator(name: "yura")): User`)
  .mutation(`deleteUser(first_name: String! @match(name:"yura")): TextSearchResult`)
  .query(`User(id: Int! ): User`)
  .query(`Users(ids: [Int!]): [User]`)
}
