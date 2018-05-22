import * as url from 'url';
import {
  GraphQLOptions,
  HttpQueryError,
  runHttpQuery,
} from './index';
import * as GraphiQL from 'apollo-server-module-graphiql';


export function graphqlExpress(options) {
  if (!options) {
    throw new Error('Apollo Server requires options.');
  }

  if (arguments.length > 1) {
    // TODO: test this
    throw new Error(
      `Apollo Server expects exactly one argument, got ${arguments.length}`,
    );
  }

  const graphqlHandler = (req, res) => {
    runHttpQuery([req, res], {
      method: req.method,
      options: options,
      query: req.method === 'POST' ? req.body : req.query,
    }).then(
      gqlResponse => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader(
          'Content-Length',
          Buffer.byteLength(gqlResponse, 'utf8').toString(),
        );
        res.write(gqlResponse);
        res.end();
      },
      (error) => {
        if ('HttpQueryError' !== error.name) {
          throw error
        }

        if (error.headers) {
          Object.keys(error.headers).forEach(header => {
            res.setHeader(header, error.headers[header]);
          });
        }

        res.statusCode = error.statusCode;
        res.write(error.message);
        res.end();
      },
    );
  };

  return graphqlHandler
}

export function graphiqlExpress (options) {
  const Handler = (req,res) => {
    const query = req.url && url.parse(req.url, true).query
    GraphiQL.resolveGraphiQLString(query, options, req).then(
      graphiqlString => {
        res.setHeader('Content-Type', 'text/html');
        res.write(graphiqlString);
        res.end()
      },
      error => {
        throw (error)
      },
    );
  };

  return Handler
}
