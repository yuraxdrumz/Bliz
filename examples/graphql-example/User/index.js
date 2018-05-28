import userSchema from './schema'
import userResolver from './resolver'

export default function UserSchema (app) {
  return app.createGraphQlSchema(userSchema)
  .resolver(userResolver)
  .mutation(`
      createUser(input: newUser @auth @validateNewUser @constraint(length: 3)): User
      deleteUser(first_name: String! @match(name:"yura")): User
  `)
  .query(`User(id: Int! ): User`)
}
