const schema = `
type User{
  first_name: String!
  role: Role!
  last_name: String!
  height: Height
  posts: [Post]
}
input newUser{
  first_name: String!
  last_name: String!
  height: String!
}
`

export default schema
