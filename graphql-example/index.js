import Bliz from '../src/main'
import PostSchema from './Post'
import UserSchema from './User'

const app = Bliz()

app
    .prettyPrint()
    .graphql({enabled: true})
    .registerGraphQlSchemas(UserSchema(app), PostSchema(app))
    .inject({
        UserModel: {}
    })
    .listen(4000)
