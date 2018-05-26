const schema = `
type Post{
    name: String!
    id: Int!
    data: String
}
input newPost{
    name: String!
    id: Int!
    data: String
}
`

export default schema
