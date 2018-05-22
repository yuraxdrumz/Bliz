import * as url from 'url';
import {
  GraphQLOptions,
  HttpQueryError,
  runHttpQuery,
} from './index';
import * as GraphiQL from 'apollo-server-module-graphiql';

export interface GraphQLOptionsFunction {
  (req?: Request, res?: Response):
    | GraphQLOptions
    | Promise<GraphQLOptions>;
}

// Design principles:
// - there is just one way allowed: POST request with JSON body. Nothing else.
// - simple, fast and secure
//

export interface Handler {
  (req: Request, res: Response): void;
}

export function graphqlExpress(
  options: GraphQLOptions | GraphQLOptionsFunction,
): Handler {
  if (!options) {
    throw new Error('Apollo Server requires options.');
  }

  if (arguments.length > 1) {
    // TODO: test this
    throw new Error(
      `Apollo Server expects exactly one argument, got ${arguments.length}`,
    );
  }

  const graphqlHandler = (
    req: Request,
    res: Response,
  ): void => {
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
      (error: HttpQueryError) => {
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

export interface GraphiQLOptionsFunction {
  (req?: Request):
    | GraphiQL.GraphiQLData
    | Promise<GraphiQL.GraphiQLData>;
}

/* This middleware returns the html for the GraphiQL interactive query UI
 *
 * GraphiQLData arguments
 *
 * - endpointURL: the relative or absolute URL for the endpoint which GraphiQL will make queries to
 * - (optional) query: the GraphQL query to pre-fill in the GraphiQL UI
 * - (optional) variables: a JS object of variables to pre-fill in the GraphiQL UI
 * - (optional) operationName: the operationName to pre-fill in the GraphiQL UI
 * - (optional) result: the result of the query to pre-fill in the GraphiQL UI
 */

export function graphiqlExpress(
  options: GraphiQL.GraphiQLData | GraphiQLOptionsFunction,
) {
  const Handler = (
    req: Request,
    res: Response
  ) => {
    const query = req.url && url.parse(req.url, true).query;
    GraphiQL.resolveGraphiQLString(query, options, req).then(
      graphiqlString => {
        res.setHeader('Content-Type', 'text/html');
        res.write(graphiqlString);
        res.end();
      },
      error => {
        throw(error)
      },
    );
  };

  return Handler;
}
