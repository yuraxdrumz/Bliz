import { paramSchema, querySchema, responseSchema, errorSchema } from './schemas'

export default function testHandler (app) {
  return app
  .createPath('/test/:param')
  .handler((req, res) => res.json({params: req.params, query: req.query, files: req.files}))
  .describe({
    tags: ['main route', 'simple tag'],
    summary: 'simple summary for swagger',
    description: 'returns whatever it receives',
    incoming: [{in: 'path', schema: paramSchema}, {in: 'query', schema: querySchema}],
    outgoing: [{status: 200, schema: responseSchema}, {status: 400, schema: errorSchema}]
  })
  .middleware((req, res, next) => {
    console.log('works like a charm!')
    next()
  })
}
