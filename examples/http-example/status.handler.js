import { paramSchema, statusSchema, responseSchema, errorSchema } from './schemas'

export default function statusHandler (app) {
  return app
  .createPath('/:status/')
  .handler((req, res) => res.json({params: req.params, query: req.query}))
  .describe({
    tags: ['oven', 'jenkins'],
    summary: 'simple summary for swagger',
    description: 'returns whatever it receives',
    incoming: [{in: 'body', schema: paramSchema}, {in:'path', schema: statusSchema}],
    outgoing: [{status: 200, schema: responseSchema}, {status: 400, schema: errorSchema}]
  })
}