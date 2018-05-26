const schema = `
type User {
  first_name: String! @hasRole(role: User)
  role: Role! @hasRole(role: Admin)
  last_name: String!
  height: Height
  posts: [Post] @hasRole(role: Admin)
}
input newUser {
  first_name: String!
  last_name: String!
  height: String!
}
`

export default schema
