import statusHandler from './status.handler'
import testHandler from './test.handler'

export default function slashRouter (app) {
  return app
  .createRouter('/api/')
  .post(statusHandler(app))
  .post(testHandler(app))
  .middleware((req, res, next) => {
    console.log('hit /api')
    next()
  })
}
