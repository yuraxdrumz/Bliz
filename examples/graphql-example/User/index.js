import userSchema from './schema'
import userResolver from './resolver'

export default function UserSchema (app) {
  return app.createGraphQlSchema(userSchema)
  .resolver(userResolver)
  .mutation(`
      createUser(input: newUser): User
      deleteUser(first_name: String!): User
  `)
  .query(`User(id: Int!): User`)
}
