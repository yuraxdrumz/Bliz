require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./examples/graphql-example/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/graphql-example/Post/index.js":
/*!************************************************!*\
  !*** ./examples/graphql-example/Post/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PostSchema;

var _schema = __webpack_require__(/*! ./schema */ "./examples/graphql-example/Post/schema.js");

var _schema2 = _interopRequireDefault(_schema);

var _resolver = __webpack_require__(/*! ./resolver */ "./examples/graphql-example/Post/resolver.js");

var _resolver2 = _interopRequireDefault(_resolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PostSchema(app) {
  return app.createGraphQlSchema(_schema2.default).resolver(_resolver2.default).query('Post(id: Int!): Post').mutation('Post(input: newPost): Post').subscription('postAdded: Post');
}

/***/ }),

/***/ "./examples/graphql-example/Post/resolver.js":
/*!***************************************************!*\
  !*** ./examples/graphql-example/Post/resolver.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var resolver = {
    Query: {
        Post: function Post(obj, args, context, info) {
            return { name: 'asdsda', id: args.id };
        }
    },
    Post: {
        name: function name(post, args, context, info) {
            return post.name;
        },
        id: function id(post, args, context, info) {
            return post.id;
        },
        data: function data(post, args, context, info) {
            return post.data;
        }
    },
    Subscription: function Subscription(pubsub) {
        return {
            postAdded: {
                subscribe: function subscribe() {
                    return pubsub.asyncIterator('POST_ADDED');
                }
            }
        };
    },
    Mutation: function Mutation(pubsub) {
        return {
            Post: function Post(obj, args, context, info) {
                pubsub.publish('POST_ADDED', { postAdded: args.input });
                return _extends({}, args.input);
            }
        };
    }
};

exports.default = resolver;

/***/ }),

/***/ "./examples/graphql-example/Post/schema.js":
/*!*************************************************!*\
  !*** ./examples/graphql-example/Post/schema.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var schema = "\ntype Post{\n    name: String!\n    id: Int!\n    data: String\n}\ninput newPost{\n    name: String!\n    id: Int!\n    data: String\n}\n";

exports.default = schema;

/***/ }),

/***/ "./examples/graphql-example/User/index.js":
/*!************************************************!*\
  !*** ./examples/graphql-example/User/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = UserSchema;

var _schema = __webpack_require__(/*! ./schema */ "./examples/graphql-example/User/schema.js");

var _schema2 = _interopRequireDefault(_schema);

var _resolver = __webpack_require__(/*! ./resolver */ "./examples/graphql-example/User/resolver.js");

var _resolver2 = _interopRequireDefault(_resolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function UserSchema(app) {
  return app.createGraphQlSchema(_schema2.default).resolver(_resolver2.default).mutation('\n      createUser(input: newUser): User\n      deleteUser(first_name: String!): User\n  ').query('User(id: Int!): User');
}

/***/ }),

/***/ "./examples/graphql-example/User/resolver.js":
/*!***************************************************!*\
  !*** ./examples/graphql-example/User/resolver.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var resolver = {
    Query: {
        User: function User(obj, args, context, info) {
            return { first_name: 'Yura', last_name: 'Khomyakov', height: "tall", role: 'Admin' };
        }
    },
    User: {
        first_name: function first_name(user, args, context, info) {
            return user.first_name;
        },
        last_name: function last_name(user, args, context, info) {
            return user.last_name;
        },
        role: function role(user) {
            return user.role;
        },
        posts: function posts(user, args, context, info) {
            return [{ name: 'post', id: 1, data: 'data' }];
        }
    },
    Mutation: function Mutation(pubsub) {
        return {
            createUser: function createUser(root, _ref, context) {
                var input = _ref.input;

                return input;
            },
            deleteUser: function deleteUser(root, args, context) {
                return { first_name: args.first_name, last_name: 'whatever' };
            }
        };
    }
};

exports.default = resolver;

/***/ }),

/***/ "./examples/graphql-example/User/schema.js":
/*!*************************************************!*\
  !*** ./examples/graphql-example/User/schema.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var schema = "\ntype User {\n  first_name: String! @hasRole(role: User)\n  role: Role! @hasRole(role: Admin)\n  last_name: String!\n  height: Height\n  posts: [Post] @hasRole(role: Admin)\n}\ninput newUser @rest {\n  first_name: String!\n  last_name: String!\n  height: String!\n}\n";

exports.default = schema;

/***/ }),

/***/ "./examples/graphql-example/index.js":
/*!*******************************************!*\
  !*** ./examples/graphql-example/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _main = __webpack_require__(/*! ../../src/main */ "./src/main.js");

var _main2 = _interopRequireDefault(_main);

var _Post = __webpack_require__(/*! ./Post */ "./examples/graphql-example/Post/index.js");

var _Post2 = _interopRequireDefault(_Post);

var _User = __webpack_require__(/*! ./User */ "./examples/graphql-example/User/index.js");

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _main2.default)();

app.prettyPrint().graphql({ useGraphql: true, allowPartialRemoteSchema: true, useGraphiql: true, tracing: true }).registerGraphQlSchemas((0, _User2.default)(app), (0, _Post2.default)(app)).enum({ name: 'Height', options: ['tall', 'short', 'average'] }).enum({ name: 'Role', options: ['Admin', 'User'] })
// .directive(`@hasRole(role: Role) on QUERY | FIELD`)
// .directive(`@isAuthenticated on QUERY | FIELD`)
// .directive(`@listen(max: Int!) on OBJECT | INPUT_FIELD_DEFINITION | FIELD_DEFINITION`)
.directive('@rest on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | OBJECT | INPUT_OBJECT').listen(4000);

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, bugs, homepage, description, main, scripts, devDependencies, keywords, repository, author, license, dependencies, default */
/***/ (function(module) {

module.exports = {"name":"bliz","version":"0.1.14","bugs":{"url":"https://github.com/yuraxdrumz/Bliz/issues","email":"yurik1776@gmail.com"},"homepage":"https://github.com/yuraxdrumz/Bliz#readme","description":"A fast, declarative framework for writing web servers, no taradiddles","main":"./dist/bundle.js","scripts":{"prettier":"prettier --write src/**/*.js","test":"jest","start":"rimraf ./dist && webpack --mode development --watch","build":"rimraf ./dist && webpack -p --progress --config=webpack.config.prod.js --mode production"},"devDependencies":{"babel-core":"^6.25.0","babel-loader":"^7.1.1","babel-plugin-add-module-exports":"^0.2.1","babel-plugin-transform-object-rest-spread":"^6.26.0","babel-preset-env":"^1.7.0","jest":"^21.2.1","prettier":"1.12.1","rimraf":"^2.6.2","source-map-support":"^0.4.15","webpack":"^4.8.3","webpack-cli":"^2.1.4","webpack-node-server-plugin":"^0.2.1"},"keywords":["http","server","express-like","web","sockets","graphql","declarative","simple"],"repository":"yuraxdrumz/Bliz","author":"Yuri Khomyakov","license":"MIT","dependencies":{"apollo-cache-control":"^0.1.1","apollo-client-preset":"^1.0.8","apollo-link-http":"^1.5.4","apollo-server-module-graphiql":"^1.3.4","apollo-tracing":"^0.1.4","apollo-utilities":"^1.0.12","babel-polyfill":"^6.26.0","bluebird":"^3.5.1","body-parser":"^1.18.3","etag":"^1.8.1","eventemitter2":"^4.1.2","graphql":"^0.13.2","graphql-extensions":"0.0.10","graphql-subscriptions":"^0.5.8","graphql-tools":"^3.0.2","json-to-pretty-yaml":"^1.2.2","node-fetch":"^2.1.2","print-message":"^2.1.0","socket.io":"^2.1.1","subscriptions-transport-ws":"^0.9.9","superstruct":"^0.5.4","treeify":"^1.0.1","url":"^0.11.0","ws":"^5.2.0"}};

/***/ }),

/***/ "./src/apolloServer/graphqlOptions.js":
/*!********************************************!*\
  !*** ./src/apolloServer/graphqlOptions.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var resolveGraphqlOptions = exports.resolveGraphqlOptions = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
    var _len,
        args,
        _key,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof options === 'function')) {
              _context.next = 13;
              break;
            }

            _context.prev = 1;

            for (_len = _args.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = _args[_key];
            }

            _context.next = 5;
            return options.apply(undefined, _toConsumableArray(args));

          case 5:
            return _context.abrupt('return', _context.sent);

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](1);
            throw new Error('Invalid options provided to ApolloServer: ' + _context.t0.message);

          case 11:
            _context.next = 14;
            break;

          case 13:
            return _context.abrupt('return', options);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 8]]);
  }));

  return function resolveGraphqlOptions(_x) {
    return _ref.apply(this, arguments);
  };
}();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/***/ }),

/***/ "./src/apolloServer/index.js":
/*!***********************************!*\
  !*** ./src/apolloServer/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _runQuery = __webpack_require__(/*! ./runQuery */ "./src/apolloServer/runQuery.js");

Object.defineProperty(exports, 'runQuery', {
  enumerable: true,
  get: function get() {
    return _runQuery.runQuery;
  }
});
Object.defineProperty(exports, 'LogFunction', {
  enumerable: true,
  get: function get() {
    return _runQuery.LogFunction;
  }
});
Object.defineProperty(exports, 'LogMessage', {
  enumerable: true,
  get: function get() {
    return _runQuery.LogMessage;
  }
});
Object.defineProperty(exports, 'LogStep', {
  enumerable: true,
  get: function get() {
    return _runQuery.LogStep;
  }
});
Object.defineProperty(exports, 'LogAction', {
  enumerable: true,
  get: function get() {
    return _runQuery.LogAction;
  }
});

var _runHttpQuery = __webpack_require__(/*! ./runHttpQuery */ "./src/apolloServer/runHttpQuery.js");

Object.defineProperty(exports, 'runHttpQuery', {
  enumerable: true,
  get: function get() {
    return _runHttpQuery.runHttpQuery;
  }
});
Object.defineProperty(exports, 'HttpQueryError', {
  enumerable: true,
  get: function get() {
    return _runHttpQuery.HttpQueryError;
  }
});

var _graphqlOptions = __webpack_require__(/*! ./graphqlOptions */ "./src/apolloServer/graphqlOptions.js");

Object.defineProperty(exports, 'resolveGraphqlOptions', {
  enumerable: true,
  get: function get() {
    return _graphqlOptions.resolveGraphqlOptions;
  }
});

/***/ }),

/***/ "./src/apolloServer/main.js":
/*!**********************************!*\
  !*** ./src/apolloServer/main.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlExpress = graphqlExpress;
exports.graphiqlExpress = graphiqlExpress;

var _url = __webpack_require__(/*! url */ "url");

var url = _interopRequireWildcard(_url);

var _index = __webpack_require__(/*! ./index */ "./src/apolloServer/index.js");

var _apolloServerModuleGraphiql = __webpack_require__(/*! apollo-server-module-graphiql */ "apollo-server-module-graphiql");

var GraphiQL = _interopRequireWildcard(_apolloServerModuleGraphiql);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function graphqlExpress(options) {
  if (!options) {
    throw new Error('Apollo Server requires options.');
  }

  if (arguments.length > 1) {
    // TODO: test this
    throw new Error('Apollo Server expects exactly one argument, got ' + arguments.length);
  }

  var graphqlHandler = function graphqlHandler(req, res) {
    (0, _index.runHttpQuery)([req, res], {
      method: req.method,
      options: options,
      query: req.method === 'POST' ? req.body : req.query
    }).then(function (gqlResponse) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Length', Buffer.byteLength(gqlResponse, 'utf8').toString());
      res.write(gqlResponse);
      res.end();
    }, function (error) {
      // if ('HttpQueryError' !== error.name) {
      //   throw error
      // }

      if (error.headers) {
        Object.keys(error.headers).forEach(function (header) {
          res.setHeader(header, error.headers[header]);
        });
      }

      res.statusCode = error.statusCode || 500;
      res.write(error.message);
      res.end();
    });
  };

  return graphqlHandler;
}

function graphiqlExpress(options) {
  var Handler = function Handler(req, res) {
    var query = req.url && url.parse(req.url, true).query;
    GraphiQL.resolveGraphiQLString(query, options, req).then(function (graphiqlString) {
      res.setHeader('Content-Type', 'text/html');
      res.write(graphiqlString);
      res.end();
    }, function (error) {
      throw error;
    });
  };

  return Handler;
}

/***/ }),

/***/ "./src/apolloServer/runHttpQuery.js":
/*!******************************************!*\
  !*** ./src/apolloServer/runHttpQuery.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runHttpQuery = exports.HttpQueryError = undefined;

var runHttpQuery = exports.runHttpQuery = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(handlerArguments, request) {
    var isGetRequest, optionsObject, formatErrorFn, requestPayload, isBatch, requests, responses, gqlResponse;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            isGetRequest = false;
            optionsObject = void 0;
            _context.prev = 2;
            _context.next = 5;
            return _graphqlOptions.resolveGraphqlOptions.apply(undefined, [request.options].concat(_toConsumableArray(handlerArguments)));

          case 5:
            optionsObject = _context.sent;
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](2);
            throw new HttpQueryError(500, _context.t0.message);

          case 11:
            formatErrorFn = optionsObject.formatError || _graphql.formatError;
            requestPayload = void 0;
            _context.t1 = request.method;
            _context.next = _context.t1 === 'POST' ? 16 : _context.t1 === 'GET' ? 20 : 25;
            break;

          case 16:
            if (!(!request.query || Object.keys(request.query).length === 0)) {
              _context.next = 18;
              break;
            }

            throw new HttpQueryError(500, 'POST body missing. Did you forget use body-parser middleware?');

          case 18:
            requestPayload = request.query;
            return _context.abrupt('break', 26);

          case 20:
            if (!(!request.query || Object.keys(request.query).length === 0)) {
              _context.next = 22;
              break;
            }

            throw new HttpQueryError(400, 'GET query missing.');

          case 22:

            isGetRequest = true;
            requestPayload = request.query;
            return _context.abrupt('break', 26);

          case 25:
            throw new HttpQueryError(405, 'Apollo Server supports only GET/POST requests.', false, {
              Allow: 'GET, POST'
            });

          case 26:
            isBatch = true;
            // TODO: do something different here if the body is an array.
            // Throw an error if body isn't either array or object.

            if (!Array.isArray(requestPayload)) {
              isBatch = false;
              requestPayload = [requestPayload];
            }
            requests = requestPayload.map(function (requestParams) {
              try {
                var query = requestParams.query;
                var extensions = requestParams.extensions;
                if (isGetRequest && extensions) {
                  // For GET requests, we have to JSON-parse extensions. (For POST
                  // requests they get parsed as part of parsing the larger body they're
                  // inside.)
                  try {
                    extensions = JSON.parse(extensions);
                  } catch (error) {
                    throw new HttpQueryError(400, 'Extensions are invalid JSON.');
                  }
                }

                if (query === undefined && extensions && extensions.persistedQuery) {
                  // It looks like we've received an Apollo Persisted Query. Apollo Server
                  // does not support persisted queries out of the box, so we should fail
                  // fast with a clear error saying that we don't support APQs. (A future
                  // version of Apollo Server may support APQs directly.)
                  throw new HttpQueryError(
                  // Return 200 to simplify processing: we want this to be intepreted by
                  // the client as data worth interpreting, not an error.
                  200, JSON.stringify({
                    errors: [{
                      message: 'PersistedQueryNotSupported'
                    }]
                  }), true, {
                    'Content-Type': 'application/json'
                  });
                }

                if (isGetRequest) {
                  if (typeof query === 'string') {
                    // preparse the query incase of GET so we can assert the operation.
                    // XXX This makes the type of 'query' in this function confused
                    //     which has led to us accidentally supporting GraphQL AST over
                    //     the wire as a valid query, which confuses users. Refactor to
                    //     not do this. Also, for a GET request, query really shouldn't
                    //     ever be anything other than a string or undefined, so this
                    //     set of conditionals doesn't quite make sense.
                    query = (0, _graphql.parse)(query);
                  } else if (!query) {
                    // Note that we've already thrown a different error if it looks like APQ.
                    throw new HttpQueryError(400, 'Must provide query string.');
                  }

                  if (!isQueryOperation(query, requestParams.operationName)) {
                    throw new HttpQueryError(405, 'GET supports only query operation', false, {
                      Allow: 'POST'
                    });
                  }
                }

                var operationName = requestParams.operationName;

                var variables = requestParams.variables;
                if (typeof variables === 'string') {
                  try {
                    // XXX Really we should only do this for GET requests, but for
                    // compatibility reasons we'll keep doing this at least for now for
                    // broken clients that ship variables in a string for no good reason.
                    variables = JSON.parse(variables);
                  } catch (error) {
                    throw new HttpQueryError(400, 'Variables are invalid JSON.');
                  }
                }

                var context = optionsObject.context || {};
                if (typeof context === 'function') {
                  context = context();
                } else if (isBatch) {
                  context = Object.assign(Object.create(Object.getPrototypeOf(context)), context);
                }
                var params = {
                  schema: optionsObject.schema,
                  query: query,
                  variables: variables,
                  context: context,
                  rootValue: optionsObject.rootValue,
                  operationName: operationName,
                  logFunction: optionsObject.logFunction,
                  validationRules: optionsObject.validationRules,
                  formatError: formatErrorFn,
                  formatResponse: optionsObject.formatResponse,
                  fieldResolver: optionsObject.fieldResolver,
                  debug: optionsObject.debug,
                  tracing: optionsObject.tracing,
                  cacheControl: optionsObject.cacheControl
                };

                if (optionsObject.formatParams) {
                  params = optionsObject.formatParams(params);
                }
                return (0, _runQuery.runQuery)(params);
              } catch (e) {
                // Populate any HttpQueryError to our handler which should
                // convert it to Http Error.
                if (e.name === 'HttpQueryError') {
                  return Promise.reject(e);
                }

                return Promise.resolve({ errors: [formatErrorFn(e)] });
              }
            });
            _context.next = 31;
            return Promise.all(requests);

          case 31:
            responses = _context.sent;

            if (isBatch) {
              _context.next = 37;
              break;
            }

            gqlResponse = responses[0];

            if (!(gqlResponse.errors && typeof gqlResponse.data === 'undefined')) {
              _context.next = 36;
              break;
            }

            throw new HttpQueryError(400, JSON.stringify(gqlResponse), true, {
              'Content-Type': 'application/json'
            });

          case 36:
            return _context.abrupt('return', JSON.stringify(gqlResponse));

          case 37:
            return _context.abrupt('return', JSON.stringify(responses));

          case 38:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 8]]);
  }));

  return function runHttpQuery(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _graphql = __webpack_require__(/*! graphql */ "graphql");

var _runQuery = __webpack_require__(/*! ./runQuery */ "./src/apolloServer/runQuery.js");

var _graphqlOptions = __webpack_require__(/*! ./graphqlOptions */ "./src/apolloServer/graphqlOptions.js");

var _graphqlOptions2 = _interopRequireDefault(_graphqlOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HttpQueryError = exports.HttpQueryError = function (_Error) {
  _inherits(HttpQueryError, _Error);

  function HttpQueryError(statusCode, message) {
    var isGraphQLError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var headers = arguments[3];

    _classCallCheck(this, HttpQueryError);

    var _this = _possibleConstructorReturn(this, (HttpQueryError.__proto__ || Object.getPrototypeOf(HttpQueryError)).call(this, message));

    _this.name = 'HttpQueryError';
    _this.statusCode = statusCode;
    _this.isGraphQLError = isGraphQLError;
    _this.headers = headers;
    return _this;
  }

  return HttpQueryError;
}(Error);

function isQueryOperation(query, operationName) {
  var operationAST = (0, _graphql.getOperationAST)(query, operationName);
  return operationAST.operation === 'query';
}

/***/ }),

/***/ "./src/apolloServer/runQuery.js":
/*!**************************************!*\
  !*** ./src/apolloServer/runQuery.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryOptions = exports.LogMessage = exports.LogStep = exports.LogAction = exports.GraphQLResponse = undefined;
exports.LogFunction = LogFunction;
exports.runQuery = runQuery;

var _graphql = __webpack_require__(/*! graphql */ "graphql");

var _graphqlExtensions = __webpack_require__(/*! graphql-extensions */ "graphql-extensions");

var _apolloTracing = __webpack_require__(/*! apollo-tracing */ "apollo-tracing");

var _apolloCacheControl = __webpack_require__(/*! apollo-cache-control */ "apollo-cache-control");

var GraphQLResponse = exports.GraphQLResponse = {
  data: {},
  errors: [],
  extensions: {}
};

var LogAction = exports.LogAction = {
  request: '',
  parse: '',
  validation: '',
  execute: ''
};

var LogStep = exports.LogStep = {
  start: '',
  end: '',
  status: ''
};

var LogMessage = exports.LogMessage = {
  action: LogAction,
  step: LogStep,
  key: '',
  data: {}
};

function LogFunction(message) {}

var QueryOptions = exports.QueryOptions = {
  schema: {},
  query: '',
  rootValue: {},
  context: {},
  variables: {},
  operationName: '',
  logFunction: LogFunction,
  validationRules: [],
  fieldResolver: {},
  formatError: Function,
  formatResponse: Function,
  debug: false,
  tracing: false,
  cacheControl: false
};

function runQuery(options) {
  // Fiber-aware Promises run their .then callbacks in Fibers.
  return Promise.resolve().then(function () {
    return doRunQuery(options);
  });
}

function printStackTrace(error) {
  console.error(error.stack);
}

function format(errors, formatter) {
  return errors.map(function (error) {
    if (formatter !== undefined) {
      try {
        return formatter(error);
      } catch (err) {
        console.error('Error in formatError function:', err);
        var newError = new Error('Internal server error');
        return (0, _graphql.formatError)(newError);
      }
    } else {
      return (0, _graphql.formatError)(error);
    }
  });
}

function doRunQuery(options) {
  var documentAST = void 0;
  var logFunction = options.logFunction || function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args;
  };
  var debugDefault = "development" !== 'production' && "development" !== 'test';
  var debug = options.debug !== undefined ? options.debug : debugDefault;

  logFunction({ action: LogAction.request, step: LogStep.start });
  var context = options.context || {};
  var extensions = [];
  if (options.tracing) {
    extensions.push(_apolloTracing.TracingExtension);
  }
  if (options.cacheControl === true) {
    extensions.push(_apolloCacheControl.CacheControlExtension);
  } else if (options.cacheControl) {
    extensions.push(new _apolloCacheControl.CacheControlExtension(options.cacheControl));
  }
  var extensionStack = extensions.length > 0 && new _graphqlExtensions.GraphQLExtensionStack(extensions);

  if (extensionStack) {
    context._extensionStack = extensionStack;
    (0, _graphqlExtensions.enableGraphQLExtensions)(options.schema);

    extensionStack.requestDidStart();
  }
  var qry = typeof options.query === 'string' ? options.query : (0, _graphql.print)(options.query);
  logFunction({
    action: LogAction.request,
    step: LogStep.status,
    key: 'query',
    data: qry
  });
  logFunction({
    action: LogAction.request,
    step: LogStep.status,
    key: 'variables',
    data: options.variables
  });
  logFunction({
    action: LogAction.request,
    step: LogStep.status,
    key: 'operationName',
    data: options.operationName
  });

  // if query is already an AST, don't parse or validate
  // XXX: This refers the operations-store flow.
  if (typeof options.query === 'string') {
    try {
      logFunction({ action: LogAction.parse, step: LogStep.start });
      documentAST = (0, _graphql.parse)(options.query);
      logFunction({ action: LogAction.parse, step: LogStep.end });
    } catch (syntaxError) {
      logFunction({ action: LogAction.parse, step: LogStep.end });
      return Promise.resolve({
        errors: format([syntaxError], options.formatError)
      });
    }
  } else {
    documentAST = options.query;
    var rules = _graphql.specifiedRules;
    if (options.validationRules) {
      rules = rules.concat(options.validationRules);
    }
    logFunction({ action: LogAction.validation, step: LogStep.start });
    var validationErrors = (0, _graphql.validate)(options.schema, documentAST, rules);
    logFunction({ action: LogAction.validation, step: LogStep.end });
    if (validationErrors.length) {
      return Promise.resolve({
        errors: format(validationErrors, options.formatError)
      });
    }

    if (extensionStack) {
      extensionStack.executionDidStart();
    }
  }
  try {
    logFunction({ action: LogAction.execute, step: LogStep.start });
    return Promise.resolve((0, _graphql.execute)(options.schema, documentAST, options.rootValue, context, options.variables, options.operationName, options.fieldResolver)).then(function (result) {
      logFunction({ action: LogAction.execute, step: LogStep.end });
      logFunction({ action: LogAction.request, step: LogStep.end });

      var response = {
        data: result.data
      };

      if (result.errors) {
        response.errors = format(result.errors, options.formatError);
        if (debug) {
          result.errors.map(printStackTrace);
        }
      }

      if (extensionStack) {
        extensionStack.executionDidEnd();
        extensionStack.requestDidEnd();
        response.extensions = extensionStack.format();
      }

      if (options.formatResponse) {
        response = options.formatResponse(response, options);
      }
      return response;
    });
  } catch (executionError) {
    logFunction({ action: LogAction.execute, step: LogStep.end });
    logFunction({ action: LogAction.request, step: LogStep.end });
    return Promise.resolve({
      errors: format([executionError], options.formatError)
    });
  }
}

/***/ }),

/***/ "./src/graphql/graphQlHandler.js":
/*!***************************************!*\
  !*** ./src/graphql/graphQlHandler.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// graphql handler, called from listen func when useGraphql is set to true
exports.default = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref) {
    var _this2 = this;

    var server = _ref.server,
        args = _ref.args,
        _useGraphql = _ref._useGraphql,
        _internal = _ref._internal,
        PubSub = _ref.PubSub,
        makeExecutableSchema = _ref.makeExecutableSchema,
        getIntrospectSchema = _ref.getIntrospectSchema,
        createHttpLink = _ref.createHttpLink,
        HttpLink = _ref.HttpLink,
        fetch = _ref.fetch,
        introspectSchema = _ref.introspectSchema,
        makeRemoteExecutableSchema = _ref.makeRemoteExecutableSchema,
        mergeSchemas = _ref.mergeSchemas,
        bodyParser = _ref.bodyParser,
        graphiqlExpress = _ref.graphiqlExpress,
        graphqlExpress = _ref.graphqlExpress,
        SubscriptionServer = _ref.SubscriptionServer,
        SubscriptionClient = _ref.SubscriptionClient,
        ws = _ref.ws,
        getMainDefinition = _ref.getMainDefinition,
        split = _ref.split,
        os = _ref.os,
        print = _ref.print,
        execute = _ref.execute,
        subscribe = _ref.subscribe,
        Promise = _ref.Promise,
        _injected = _ref._injected,
        _Instance = _ref._Instance,
        _version = _ref._version,
        SchemaDirectiveVisitor = _ref.SchemaDirectiveVisitor,
        GraphQLScalarType = _ref.GraphQLScalarType,
        GraphQLNonNull = _ref.GraphQLNonNull,
        defaultFieldResolver = _ref.defaultFieldResolver,
        GraphQLString = _ref.GraphQLString;

    var executableSchema, directives, enums, schemas, pubsub, finalGraphQlOptionsObject, Directives, Query, Mutation, Subscription, Types, Enums, resolvers, typeDefs, getIntrospectSchemaWithParams, router, graphiqlRoute, graphqlRoute, _server;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // init executableSchema, if directives length !== to their resolvers, throw error
            executableSchema = null;
            directives = _useGraphql._graphQlDirectives;
            // if (directives.length !== Object.keys(_useGraphql.directiveResolvers).length) {
            //   throw new Error(`Directive resolvers registered does not match directive declarations`)
            // }

            enums = _useGraphql._graphQlEnums;
            schemas = _useGraphql._graphQlSchemas.schemas;
            // use default pubsub for subscriptions if one is not passed

            pubsub = _useGraphql.pubsub || new PubSub();
            // init graphql object, pass all app.inject to it and pubsub

            finalGraphQlOptionsObject = {
              schema: executableSchema,
              logger: _useGraphql.logger,
              context: Object.assign({}, _injected, { pubsub: pubsub }),
              tracing: _useGraphql.tracing,
              cacheControl: _useGraphql.cacheControl,
              directiveResolvers: _useGraphql.directiveResolvers
              // if remote endpoints is empty create local schemas, if not empty, create remote schemas
            };

            if (!(_useGraphql._graphQlRemoteEndpoints.length === 0)) {
              _context3.next = 10;
              break;
            }

            if (_useGraphql._graphQlExecutableSchema) {
              // if schema passed from outside use it
              executableSchema = _useGraphql._graphQlExecutableSchema;
            } else {
              // create schema, run on all data received and assemble a valid schema
              Directives = '';
              Query = 'type Query{\n';
              Mutation = 'type Mutation{\n';
              Subscription = 'type Subscription{\n';
              Types = '';
              Enums = '';
              resolvers = { Query: {}, Mutation: {}, Subscription: {} };

              enums.map(function (Enum) {
                Enums += 'enum ' + Enum.name + '{\n' + Enum.options.map(function (option) {
                  return '\t' + option + '\n';
                }).join('') + '}\n';
              });
              directives.map(function (dir) {
                Directives += dir.includes('directive') ? dir + '\n' : 'directive ' + dir + '\n';
              });
              schemas.map(function (schema) {
                var schemaProps = schema.getObjProps();
                if (schemaProps.query) {
                  Query += '\t' + schemaProps.query + '\n';
                }
                if (schemaProps.mutation) {
                  Mutation += '\t' + schemaProps.mutation + '\n';
                }
                if (schemaProps.subscription) {
                  Subscription += '\t' + schemaProps.subscription + '\n';
                }
                if (schemaProps.type) {
                  Types += schemaProps.type + '\n';
                }
                if (schemaProps.resolver) {
                  var _schemaProps$resolver = schemaProps.resolver,
                      _Query = _schemaProps$resolver.Query,
                      _Mutation = _schemaProps$resolver.Mutation,
                      _Subscription = _schemaProps$resolver.Subscription,
                      props = _objectWithoutProperties(_schemaProps$resolver, ['Query', 'Mutation', 'Subscription']);

                  if (_Query) {
                    Object.assign(resolvers.Query, typeof _Query === 'function' ? _Query(pubsub) : _Query);
                  }
                  if (_Mutation) {
                    Object.assign(resolvers.Mutation, typeof _Mutation === 'function' ? _Mutation(pubsub) : _Mutation);
                  }
                  if (_Subscription) {
                    Object.assign(resolvers.Subscription, typeof _Subscription === 'function' ? _Subscription(pubsub) : _Subscription);
                  }
                  Object.assign(resolvers, props);
                }
              });
              if (Object.keys(resolvers.Query).length === 0) {
                delete resolvers.Query;
              }
              if (Object.keys(resolvers.Mutation).length === 0) {
                delete resolvers.Mutation;
              }
              if (Object.keys(resolvers.Subscription).length === 0) {
                delete resolvers.Subscription;
              }
              Query += '}';
              Mutation += '}';
              Subscription += '}';
              typeDefs = '';

              if (Directives !== '') {
                typeDefs += Directives + '\n';
              }
              if (Enums !== '') {
                typeDefs += Enums + '\n';
              }
              if (Types !== '') {
                typeDefs += Types + '\n';
              }
              if (Query !== 'type Query{\n}') {
                typeDefs += Query + '\n';
              }
              if (Mutation !== 'type Mutation{\n}') {
                typeDefs += Mutation + '\n';
              }
              if (Subscription !== 'type Subscription{\n}') {
                typeDefs += Subscription + '\n';
              }
              finalGraphQlOptionsObject.rootValue = resolvers;
              executableSchema = makeExecutableSchema({
                typeDefs: typeDefs,
                resolvers: resolvers
                // directiveResolvers: _useGraphql.directiveResolvers
              });

              SchemaDirectiveVisitor.visitSchemaDirectives(executableSchema, {
                rest: function (_SchemaDirectiveVisit) {
                  _inherits(rest, _SchemaDirectiveVisit);

                  function rest() {
                    _classCallCheck(this, rest);

                    return _possibleConstructorReturn(this, (rest.__proto__ || Object.getPrototypeOf(rest)).apply(this, arguments));
                  }

                  _createClass(rest, [{
                    key: 'visitInputFieldDefinition',
                    value: function visitInputFieldDefinition(field) {
                      this.wrapType(field);
                    }
                  }, {
                    key: 'visitFieldDefinition',
                    value: function visitFieldDefinition(field, details) {
                      console.log('visiting field definition with', field, details);
                      this.wrapType(field);
                    }
                  }, {
                    key: 'visitInputObject',
                    value: function visitInputObject(field) {
                      console.log('inside visit input object');
                      this.wrapType(field);
                    }
                  }, {
                    key: 'visitObject',
                    value: function visitObject(field) {
                      console.log('inside visit object');
                      this.wrapType(field);
                    }
                  }, {
                    key: 'wrapType',
                    value: function wrapType(field) {
                      var _field$resolve = field.resolve,
                          resolve = _field$resolve === undefined ? defaultFieldResolver : _field$resolve;

                      var fields = field.getFields();
                      var keys = Object.keys(fields);
                      var _iteratorNormalCompletion = true;
                      var _didIteratorError = false;
                      var _iteratorError = undefined;

                      try {
                        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                          var key = _step.value;

                          console.log(fields[key]);
                          fields[key].resolve = function () {
                            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(source, args, context, info) {
                              var isValid;
                              return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      _context.next = 2;
                                      return resolve.call(this, source, args, context, info);

                                    case 2:
                                      isValid = _context.sent;

                                      console.log('isValid', args, isValid);
                                      return _context.abrupt('return', 'reerer');

                                    case 5:
                                    case 'end':
                                      return _context.stop();
                                  }
                                }
                              }, _callee, this);
                            }));

                            return function (_x2, _x3, _x4, _x5) {
                              return _ref3.apply(this, arguments);
                            };
                          }();
                        }
                      } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                          }
                        } finally {
                          if (_didIteratorError) {
                            throw _iteratorError;
                          }
                        }
                      }
                    }
                  }]);

                  return rest;
                }(SchemaDirectiveVisitor)
              });

              _useGraphql._graphQlExecutableSchema = executableSchema;
            }
            _context3.next = 22;
            break;

          case 10:
            getIntrospectSchemaWithParams = getIntrospectSchema({
              HttpLink: HttpLink,
              fetch: fetch,
              SubscriptionClient: SubscriptionClient,
              ws: ws,
              getMainDefinition: getMainDefinition,
              split: split,
              introspectSchema: introspectSchema,
              makeRemoteExecutableSchema: makeRemoteExecutableSchema
            });
            // if allowPartialRemoteSchema, catch all errors to allow partial schemas fetching

            if (!_useGraphql.allowPartialRemoteSchema) {
              _context3.next = 17;
              break;
            }

            _context3.next = 14;
            return Promise.map(_useGraphql._graphQlRemoteEndpoints, function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ep) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return getIntrospectSchemaWithParams(ep);

                      case 3:
                        return _context2.abrupt('return', _context2.sent);

                      case 6:
                        _context2.prev = 6;
                        _context2.t0 = _context2['catch'](0);

                        _useGraphql.logger.log(_context2.t0);

                      case 9:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, _this2, [[0, 6]]);
              }));

              return function (_x6) {
                return _ref4.apply(this, arguments);
              };
            }()).filter(function (item) {
              return item !== undefined;
            });

          case 14:
            executableSchema = _context3.sent;
            _context3.next = 20;
            break;

          case 17:
            _context3.next = 19;
            return Promise.all(_useGraphql._graphQlRemoteEndpoints.map(function (ep) {
              return getIntrospectSchemaWithParams(ep);
            }));

          case 19:
            executableSchema = _context3.sent;

          case 20:
            // merge remote schemas
            executableSchema = mergeSchemas({ schemas: executableSchema });
            _useGraphql._graphQlExecutableSchema = executableSchema;

          case 22:
            // create bliz router and add middleware and graphiql and graphql to it
            router = _Instance.createRouter('/').middleware(bodyParser.json());

            if (_useGraphql.useGraphiql) {
              graphiqlRoute = _Instance.createPath(_useGraphql.graphiqlRoute).handler(graphiqlExpress({
                endpointURL: _useGraphql.graphqlRoute,
                subscriptionsEndpoint: 'ws://localhost:' + args[0] + _useGraphql.subscriptionsEndpoint
              }));

              router.get(graphiqlRoute);
            }
            finalGraphQlOptionsObject.schema = executableSchema;
            graphqlRoute = _Instance.createPath(_useGraphql.graphqlRoute).handler(graphqlExpress(function (req) {
              // pass headers and body to context
              Object.assign(finalGraphQlOptionsObject.context, { headers: req.headers, body: req.body });
              return finalGraphQlOptionsObject;
            }));

            router.get(graphqlRoute).post(graphqlRoute);
            _Instance.registerRouters(router);
            _Instance.events.emit('log');
            // same as http server, only add a subscription server for graphql subscriptions

            if (!(args.length > 1)) {
              _context3.next = 35;
              break;
            }

            _server = _server.listen.apply(_server, args);

            SubscriptionServer.create({
              execute: execute,
              subscribe: subscribe,
              schema: _useGraphql._graphQlExecutableSchema
            }, {
              server: _server,
              path: _useGraphql.subscriptionsEndpoint
            });
            return _context3.abrupt('return', _server);

          case 35:
            server.listen.apply(server, [args[0], function () {
              return print(['Listening on Bliz server ' + _version + ' on port ' + args[0], 'Platform: ' + os.platform(), 'Hostname: ' + os.hostname(), 'Architecture: ' + os.arch(), 'CPU Cores: ' + os.cpus().length, 'Memory Free: ' + (os.freemem() / 1024 / 1024 / (os.totalmem() / 1024 / 1024) * 100).toFixed(0) + '%, ' + (os.freemem() / 1024 / 1024).toFixed(0) + ' MB / ' + (os.totalmem() / 1024 / 1024).toFixed(0) + ' MB']);
            }]);
            SubscriptionServer.create({
              execute: execute,
              subscribe: subscribe,
              schema: _useGraphql._graphQlExecutableSchema
            }, {
              server: server,
              path: _useGraphql.subscriptionsEndpoint
            });
            return _context3.abrupt('return', server);

          case 38:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  function graphQlHandler(_x) {
    return _ref2.apply(this, arguments);
  }

  return graphQlHandler;
}();

/***/ }),

/***/ "./src/graphql/graphQlSchema.js":
/*!**************************************!*\
  !*** ./src/graphql/graphQlSchema.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectFactories = __webpack_require__(/*! ../objectFactories */ "./src/objectFactories.js");

// graphql schema creator
var GraphQlSchemaCreator = function GraphQlSchemaCreator(type) {
  var _graphql = {};
  var _pathData = {
    type: type,
    resolver: {},
    mutation: '',
    subscription: '',
    mockSchema: null,
    query: ''
  };
  return Object.assign(_graphql, (0, _objectFactories.AssignHandler)({
    name: 'resolver',
    obj: _pathData.resolver,
    chainLink: _graphql,
    override: true
  }), (0, _objectFactories.AssignHandler)({ name: 'mockSchema', obj: _pathData, chainLink: _graphql }), (0, _objectFactories.AssignHandler)({ name: 'mutation', obj: _pathData, chainLink: _graphql }), (0, _objectFactories.AssignHandler)({ name: 'subscription', obj: _pathData, chainLink: _graphql }), (0, _objectFactories.AssignHandler)({ name: 'query', obj: _pathData, chainLink: _graphql }), (0, _objectFactories.GetObjProps)(_pathData));
};

exports.default = GraphQlSchemaCreator;

/***/ }),

/***/ "./src/http/defaultHandler.js":
/*!************************************!*\
  !*** ./src/http/defaultHandler.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _main = __webpack_require__(/*! ../main */ "./src/main.js");

// default handler for http
// if error passed from handler fire it
// else if got here -> 404
var defaultErrorHandler = function defaultErrorHandler(req, res, err) {
  if (err) {
    res.statusCode = err.status || 500;
    if (err instanceof _main.StructError) {
      res.json({
        error: err.message,
        path: err.path,
        dataPassed: err.data,
        valueReceived: err.value,
        typeExpected: err.type
      });
    } else {
      console.error(err);
      res.json({ error: err.message });
    }
  } else {
    res.statusCode = 404;
    res.json({ error: req.method.toUpperCase() + ' - ' + req.url + ' not found...' });
  }
}; // default error handler handler
exports.default = defaultErrorHandler;

/***/ }),

/***/ "./src/http/handler.js":
/*!*****************************!*\
  !*** ./src/http/handler.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// main function
function createHandler(_ref) {
  // handler to be passed to http.createServer
  var handler = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
      var _urlUtil, method, splitRest, urlCombinationOptions, _handleNestedRoutersU, baseOfRequest, rest, combinedRoutersMids, finalRest, _populateParamsUtil, param, canSkipBecauseParams, currentRoute, middleWareArr, describe, _handler, i, searchIn, statusObject, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, schema;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // set proto of req and res to point to our req and res
              req.__proto__ = request;
              res.__proto__ = response;
              // expose request and response to each other
              response.req = req;
              request.res = res;
              if (!req.params) req.params = {};
              if (!req.query) req.query = {};
              // get url parts
              _urlUtil = urlUtil(req.url, req.method), method = _urlUtil.method, splitRest = _urlUtil.splitRest;
              // check all url combinations possible

              urlCombinationOptions = populateUrlOptions(splitRest);
              // get all middlewares collected on routers

              _handleNestedRoutersU = handleNestedRoutersUtil(urlCombinationOptions, _routersObject), baseOfRequest = _handleNestedRoutersU.baseOfRequest, rest = _handleNestedRoutersU.rest, combinedRoutersMids = _handleNestedRoutersU.combinedRoutersMids;
              // populate req.query and return the final url to check on routers object

              finalRest = populateQueryUtil(req, rest) || rest;
              // populate req.params and return bool if need to skip param check or not

              _populateParamsUtil = populateParamsUtil(req, _routersObject, baseOfRequest, method, finalRest), param = _populateParamsUtil.param, canSkipBecauseParams = _populateParamsUtil.canSkipBecauseParams;
              // global middleware, if exists work with it, if throws error go to global handler
              // check routers middleware

              _context.prev = 11;

              if (!_middleWares) {
                _context.next = 15;
                break;
              }

              _context.next = 15;
              return midHandler(Promise, req, res, _middleWares);

            case 15:
              if (!combinedRoutersMids) {
                _context.next = 18;
                break;
              }

              _context.next = 18;
              return midHandler(Promise, req, res, combinedRoutersMids);

            case 18:
              _context.next = 23;
              break;

            case 20:
              _context.prev = 20;
              _context.t0 = _context['catch'](11);
              return _context.abrupt('return', defaultHandler(req, res, _context.t0));

            case 23:
              if (canSkipBecauseParams) {
                _context.next = 30;
                break;
              }

              if (_routersObject[baseOfRequest]) {
                _context.next = 26;
                break;
              }

              return _context.abrupt('return', defaultHandler(req, res));

            case 26:
              if (_routersObject[baseOfRequest][method]) {
                _context.next = 28;
                break;
              }

              return _context.abrupt('return', defaultHandler(req, res));

            case 28:
              if (_routersObject[baseOfRequest][method][finalRest]) {
                _context.next = 30;
                break;
              }

              return _context.abrupt('return', defaultHandler(req, res));

            case 30:
              // current route after all checks
              currentRoute = _routersObject[baseOfRequest][method][!canSkipBecauseParams ? finalRest : param].getObjProps();
              // try router middleware => route middleware=> route handler=> if err check route err handler=>
              // if err in err handler or err handler not exists => router err handler => if not go to global handler

              _context.prev = 31;
              middleWareArr = currentRoute.middleWareArr, describe = currentRoute.describe, _handler = currentRoute.handler;
              // if route middleware, execute

              if (!(middleWareArr && middleWareArr.length > 0)) {
                _context.next = 36;
                break;
              }

              _context.next = 36;
              return midHandler(Promise, req, res, middleWareArr);

            case 36:
              // if validation schemes exist, execute them
              if (describe && describe.incoming && describe.incoming.length > 0) {
                for (i = 0; i < describe.incoming.length; i++) {
                  searchIn = '';

                  if (describe.incoming[i].in === 'path') {
                    searchIn = 'params';
                  } else {
                    searchIn = describe.incoming[i].in;
                  }
                  describe.incoming[i].schema(req[searchIn]);
                }
              }
              // call handler with req, res and injected object from app.inject

              if (!(describe && describe.incoming && describe.incoming.length > 0)) {
                _context.next = 59;
                break;
              }

              statusObject = {};
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 42;

              for (_iterator = describe.outgoing[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                schema = _step.value;

                statusObject[schema.status] = schema.schema;
              }
              _context.next = 50;
              break;

            case 46:
              _context.prev = 46;
              _context.t1 = _context['catch'](42);
              _didIteratorError = true;
              _iteratorError = _context.t1;

            case 50:
              _context.prev = 50;
              _context.prev = 51;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 53:
              _context.prev = 53;

              if (!_didIteratorError) {
                _context.next = 56;
                break;
              }

              throw _iteratorError;

            case 56:
              return _context.finish(53);

            case 57:
              return _context.finish(50);

            case 58:
              Object.assign(res, { schema: statusObject });

            case 59:
              _context.next = 61;
              return _handler(req, res, _injected);

            case 61:
              _context.next = 66;
              break;

            case 63:
              _context.prev = 63;
              _context.t2 = _context['catch'](31);

              // here, it is the same as with middlewares but backwards, try route err handler, next up try router err handler and finally try global middleware
              try {
                if (currentRoute.errHandler) {
                  currentRoute.errHandler(req, res, _context.t2);
                } else if (_routersObject[baseOfRequest].routerErrorHandler) {
                  _routersObject[baseOfRequest].routerErrorHandler(req, res, _context.t2);
                } else {
                  defaultHandler(req, res, _context.t2);
                }
              } catch (errorFromErrorHandlers) {
                defaultHandler(req, res, errorFromErrorHandlers);
              }

            case 66:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[11, 20], [31, 63], [42, 46, 50, 58], [51,, 53, 57]]);
    }));

    return function handler(_x, _x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }();

  var request = _ref.request,
      response = _ref.response,
      defaultHandler = _ref.defaultHandler,
      midHandler = _ref.midHandler,
      urlUtil = _ref.urlUtil,
      handleNestedRoutersUtil = _ref.handleNestedRoutersUtil,
      populateParamsUtil = _ref.populateParamsUtil,
      populateQueryUtil = _ref.populateQueryUtil,
      populateUrlOptions = _ref.populateUrlOptions,
      _middleWares = _ref._middleWares,
      _routersObject = _ref._routersObject,
      _injected = _ref._injected,
      _Instance = _ref._Instance,
      Promise = _ref.Promise;

  // receive all middlewares from routers and apps if exist and concatanate them
  _middleWares = _middleWares.reduce(function (prev, curr) {
    return prev.concat(curr);
  }, []);
  return { handler: handler };
}

exports.default = createHandler;

/***/ }),

/***/ "./src/http/openApi.js":
/*!*****************************!*\
  !*** ./src/http/openApi.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mainDescribe = exports.schemas = exports.pathDescribe = undefined;

var _superstruct = __webpack_require__(/*! superstruct */ "superstruct");

var _utils = __webpack_require__(/*! ../utils */ "./src/utils.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var contactStruct = (0, _superstruct.struct)({
  name: 'string?',
  email: 'string?',
  url: 'string?'
});

var licenseStruct = (0, _superstruct.struct)({
  name: 'string?',
  url: 'string?'
});

var serverStruct = (0, _superstruct.struct)({
  url: 'string?',
  description: 'string?'
});

var infoStruct = (0, _superstruct.struct)({
  title: 'string',
  version: 'string',
  description: 'string?',
  termsOfService: 'string?',
  contact: contactStruct,
  license: licenseStruct
});

var mainDescribeStruct = (0, _superstruct.struct)({
  openapi: 'string',
  security: 'array?',
  info: infoStruct,
  servers: [serverStruct]
});

// mainDescribe block
var mainDescribe = function mainDescribe(_ref) {
  var title = _ref.title,
      version = _ref.version,
      description = _ref.description,
      termsOfService = _ref.termsOfService,
      contact = _ref.contact,
      license = _ref.license,
      servers = _ref.servers,
      security = _ref.security;

  var validJson = {
    openapi: '3.0.0',
    security: security,
    info: {
      title: title,
      version: version,
      description: description,
      termsOfService: termsOfService,
      contact: contact,
      license: license
    },
    servers: servers
  };
  return mainDescribeStruct(validJson);
};

var singlePathMetaData = (0, _superstruct.struct)({
  tags: ['string'],
  description: 'string',
  parameters: 'array?',
  requestBody: 'object?',
  summary: 'string?',
  responses: 'object?'
});

var methodStruct = function methodStruct(methodName) {
  return (0, _superstruct.struct)(_defineProperty({}, methodName === 'del' ? 'delete' : methodName, singlePathMetaData));
};

var pathStruct = function pathStruct(pathName, methodName) {
  return (0, _superstruct.struct)(_defineProperty({}, pathName, methodStruct(methodName)));
};

// recurse on structs and populate object according to struct received
var getNested = function getNested(struct) {
  var map = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var schema = struct.schema && struct.schema.schema || struct.schema;
  var keys = Object.keys(schema);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      // console.log(key, schema[key])
      if (schema[key].kind && schema[key].kind === 'object') {
        var result = getNested(schema[key], {});
        (0, _utils.assign)(map, [key, 'type'], 'object');
        (0, _utils.assign)(map, [key, 'properties'], result);
        // assign(map, [key], result)
      } else if (schema[key].kind && schema[key].kind === 'list') {
        // console.log(`schema[key]`, schema[key].type)
        (0, _utils.assign)(map, [key, 'type'], 'array');
        var type = schema[key].type.replace(/\[|\]/g, '');
        (0, _utils.assign)(map, [key, 'items', 'type'], type.replace('?', ''));
      } else if (schema[key].kind && schema[key].kind === 'enum') {
        (0, _utils.assign)(map, [key, 'type'], 'string');
        (0, _utils.assign)(map, [key, 'enum'], schema[key].type.split('|').map(function (item) {
          return item.replace(/\"/g, '').replace(/\s/g, '');
        }));
      } else if (schema[key].kind && schema[key].kind === 'scalar') {
        (0, _utils.assign)(map, [key], schema[key].type);
      } else if (schema[key].kind && schema[key].kind === 'dict') {
        (0, _utils.assign)(map, [key, 'type'], 'object');
        var _type = schema[key].type.replace(/dict\<|\>/g, '');
        (0, _utils.assign)(map, [key, 'type'], _type.substring(_type.indexOf(',') + 1));
      } else if (schema[key].kind && schema[key].kind === 'function') {} else if (schema[key].kind && schema[key].kind === 'instance') {} else if (schema[key].kind && schema[key].kind === 'interface') {} else if (schema[key].kind && schema[key].kind === 'intersection') {
        var types = schema[key].type.split('&').map(function (item) {
          return item.replace(/\s/g, '');
        }).map(function (item) {
          return 'type: ' + item;
        });
        (0, _utils.assign)(map, [key, 'allOf'], types);
      } else if (schema[key].kind && schema[key].kind === 'literal') {
        // const types = schema[key].type.replace(/literal:|\s/g, '')
        // assign(map, [key, 'type'], types)
      } else if (schema[key].kind && schema[key].kind === 'lazy') {} else if (schema[key].kind && schema[key].kind === 'tuple') {} else if (schema[key].kind && schema[key].kind === 'union') {
        var _types = schema[key].type.split('|').map(function (item) {
          return item.replace(/\s/g, '');
        }).map(function (item) {
          return 'type: ' + item;
        });
        (0, _utils.assign)(map, [key, 'anyOf'], _types);
      } else {
        // console.log(key, schema[key])
        // console.log(`assigning type array`, key, schema[key])
        (0, _utils.assign)(map, [key, 'type'], schema[key].replace('?', ''));
        if (schema[key] === 'array') {
          (0, _utils.assign)(map, [key, 'items', 'type'], 'object');
        }
      }
    }
    // console.log(`map:`, map)
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return map;
};

// add request schema based on path, method and request object
var addRequest = function addRequest(request, path, method) {
  // console.log(`REQUEST: `, request)
  if (!request) return;
  return {
    content: _defineProperty({}, request.contentType || 'application/json', {
      schema: {
        $ref: '#/components/schemas/' + path.replace(/\//g, '').replace(/-/, '').replace(/[{|}]/g, '') + '-body-' + method
      }
    })
  };
};

// build response object
var responseBuilder = function responseBuilder(responses, path, method) {
  var responseObject = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = responses[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var resp = _step2.value;

      responseObject[resp.status] = {
        description: '' + resp.status,
        content: _defineProperty({}, resp.contentType || 'application/json', {
          schema: {
            $ref: '#/components/schemas/' + path.replace(/\//g, '').replace(/-/, '').replace(/[{|}]/g, '') + '-' + resp.status + '-' + method
          }
        })
      };
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return responseObject;
};

// describe path based on data received
var pathDescribe = function pathDescribe(_ref2) {
  var path = _ref2.path,
      method = _ref2.method,
      tags = _ref2.tags,
      description = _ref2.description,
      summary = _ref2.summary,
      incoming = _ref2.incoming,
      requestBody = _ref2.requestBody,
      outgoing = _ref2.outgoing;

  // console.log(Object.keys(requests[0].schema.schema))
  var myRegexp = /(:.+?)([\/]|$)/g;
  var swaggerPath = path.replace(myRegexp, function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args[0].replace(args[1], '{' + args[1].replace(':', '') + '}');
  });
  var bodyRequests = incoming.filter(function (request) {
    return request.in === 'body';
  });
  var parametersRequests = incoming.filter(function (request) {
    return ['path', 'query'].includes(request.in);
  });
  var injectedPathWithParams = pathStruct(swaggerPath, method);
  var parametersToInject = parametersRequests.map(function (request) {
    // const all
    var arrayToConcat = [];
    var map = getNested(request, {});
    var keys = Object.keys(map);
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var key = _step3.value;

        var obj = {};
        obj.name = key;
        obj.in = request.in;
        obj.required = !map[key]['type'].includes('?');
        obj.schema = {};
        obj.schema.type = map[key]['type'].replace('?', '');
        arrayToConcat.push(obj);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return arrayToConcat;
    // console.log(objectToReturn)
  }).reduce(function (prev, curr) {
    return prev.concat(curr);
  }, []);

  var jsonWithParams = _defineProperty({}, swaggerPath, _defineProperty({}, method === 'del' ? 'delete' : method, {
    tags: tags,
    description: description,
    summary: summary,
    requestBody: addRequest(bodyRequests[0], swaggerPath, method),
    parameters: parametersToInject.length > 0 ? parametersToInject : undefined,
    responses: responseBuilder(outgoing, swaggerPath, method)
  }));
  return injectedPathWithParams(jsonWithParams);
};

// schema builder according to describe.requests object and describe.responses
var schemas = function schemas(_schemas, securitySchemes) {
  var schemasObject = {};
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = _schemas[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var sc = _step4.value;

      var data = getNested(sc);
      schemasObject[sc.name] = data[Object.keys(data)[0]];
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return {
    components: {
      securitySchemes: securitySchemes,
      schemas: schemasObject
    }
  };
};
exports.pathDescribe = pathDescribe;
exports.schemas = schemas;
exports.mainDescribe = mainDescribe;

/***/ }),

/***/ "./src/http/path.js":
/*!**************************!*\
  !*** ./src/http/path.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectFactories = __webpack_require__(/*! ../objectFactories */ "./src/objectFactories.js");

var _utils = __webpack_require__(/*! ../utils */ "./src/utils.js");

// path creator
var PathCreator = function PathCreator(path) {
  var _PathReturn = {};
  var _pathData = {
    middleWareArr: [],
    path: (0, _utils.checkBaseUtil)(path),
    describe: {},
    handler: null,
    errHandler: null,
    parent: null
  };
  return Object.assign(_PathReturn, (0, _objectFactories.AssignHandler)({
    name: 'describe',
    obj: _pathData.describe,
    chainLink: _PathReturn,
    override: true
  }), (0, _objectFactories.AssignHandler)({
    name: 'parent',
    obj: _pathData.parent,
    chainLink: _PathReturn,
    override: true
  }), (0, _objectFactories.CreateObjectArray)({ name: 'middleware', arr: _pathData.middleWareArr, chainLink: _PathReturn }), (0, _objectFactories.AssignHandler)({ name: 'handler', obj: _pathData, chainLink: _PathReturn }), (0, _objectFactories.AssignHandler)({ name: 'errHandler', obj: _pathData, chainLink: _PathReturn }), (0, _objectFactories.GetObjProps)(_pathData));
};

exports.default = PathCreator;

/***/ }),

/***/ "./src/http/request.js":
/*!*****************************!*\
  !*** ./src/http/request.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = __webpack_require__(/*! http */ "http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var req = Object.create(_http2.default.IncomingMessage.prototype);

exports.default = req;

/***/ }),

/***/ "./src/http/response.js":
/*!******************************!*\
  !*** ./src/http/response.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = __webpack_require__(/*! http */ "http");

var _http2 = _interopRequireDefault(_http);

var _etag = __webpack_require__(/*! etag */ "etag");

var _etag2 = _interopRequireDefault(_etag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var res = Object.create(_http2.default.ServerResponse.prototype);

res.status = function (status) {
  this.statusCode = status;
  return this;
};

res.json = function (data) {
  // console.log(this.req.headers)
  this.setHeader('Content-Type', 'application/json');
  this.setHeader('X-Powered-By', 'Bliz');
  var stringified = JSON.stringify(data, null, 3);
  var generatedEtag = (0, _etag2.default)(stringified);
  // console.log(generatedEtag, this.req.headers.etag)
  this.setHeader('ETag', generatedEtag);
  this.end(stringified);
};

// res.vjson = function(data){
//   console.log(this, data, this.statusCode)
//   if(this.schema[this.statusCode]){
//     this.schema[this.statusCode](data)
//   }else {
//     console.warn('no matching schema for status ' + this.statusCode)
//     this.json(data)
//   }
// }

exports.default = res;

/***/ }),

/***/ "./src/http/router.js":
/*!****************************!*\
  !*** ./src/http/router.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectFactories = __webpack_require__(/*! ../objectFactories */ "./src/objectFactories.js");

var _utils = __webpack_require__(/*! ../utils */ "./src/utils.js");

// router creator
var RouterCreator = function RouterCreator(base) {
  var _RouterReturn = {};
  var _routerData = {
    base: (0, _utils.checkBaseUtil)(base),
    get: {},
    post: {},
    put: {},
    del: {},
    middleWareArr: [],
    subRouters: [],
    routerErrorHandler: null
  };
  return Object.assign(_RouterReturn, (0, _objectFactories.Method)('get', _routerData, _RouterReturn), (0, _objectFactories.Method)('post', _routerData, _RouterReturn), (0, _objectFactories.Method)('put', _routerData, _RouterReturn), (0, _objectFactories.Method)('del', _routerData, _RouterReturn), (0, _objectFactories.AssignHandler)({ name: 'routerErrorHandler', obj: _routerData, chainLink: _RouterReturn }), (0, _objectFactories.CreateObjectArray)({
    name: 'middleware',
    arr: _routerData.middleWareArr,
    chainLink: _RouterReturn
  }), (0, _objectFactories.CreateArray)({ name: 'subRouter', obj: _routerData.subRouters, chainLink: _RouterReturn }), (0, _objectFactories.GetObjProps)(_routerData));
};

exports.default = RouterCreator;

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SchemaDirectiveVisitor = exports.StructError = exports.superstruct = exports.struct = exports.response = exports.request = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // package json


// http dependencies


// graphql dependencies


// app dependencies


__webpack_require__(/*! babel-polyfill */ "babel-polyfill");

var _package = __webpack_require__(/*! ../package.json */ "./package.json");

var _package2 = _interopRequireDefault(_package);

var _router = __webpack_require__(/*! ./http/router */ "./src/http/router.js");

var _router2 = _interopRequireDefault(_router);

var _path = __webpack_require__(/*! ./http/path */ "./src/http/path.js");

var _path2 = _interopRequireDefault(_path);

var _defaultHandler = __webpack_require__(/*! ./http/defaultHandler */ "./src/http/defaultHandler.js");

var _defaultHandler2 = _interopRequireDefault(_defaultHandler);

var _handler = __webpack_require__(/*! ./http/handler */ "./src/http/handler.js");

var _handler2 = _interopRequireDefault(_handler);

var _request = __webpack_require__(/*! ./http/request */ "./src/http/request.js");

var _request2 = _interopRequireDefault(_request);

var _response = __webpack_require__(/*! ./http/response */ "./src/http/response.js");

var _response2 = _interopRequireDefault(_response);

var _middlewareHandler = __webpack_require__(/*! ./middlewareHandler */ "./src/middlewareHandler.js");

var _middlewareHandler2 = _interopRequireDefault(_middlewareHandler);

var _socketRouter = __webpack_require__(/*! ./sockets/socketRouter */ "./src/sockets/socketRouter.js");

var _socketRouter2 = _interopRequireDefault(_socketRouter);

var _socketListener = __webpack_require__(/*! ./sockets/socketListener */ "./src/sockets/socketListener.js");

var _socketListener2 = _interopRequireDefault(_socketListener);

var _socketHandler = __webpack_require__(/*! ./sockets/socketHandler */ "./src/sockets/socketHandler.js");

var _socketHandler2 = _interopRequireDefault(_socketHandler);

var _graphQlSchema = __webpack_require__(/*! ./graphql/graphQlSchema */ "./src/graphql/graphQlSchema.js");

var _graphQlSchema2 = _interopRequireDefault(_graphQlSchema);

var _graphQlHandler = __webpack_require__(/*! ./graphql/graphQlHandler */ "./src/graphql/graphQlHandler.js");

var _graphQlHandler2 = _interopRequireDefault(_graphQlHandler);

var _graphql = __webpack_require__(/*! graphql */ "graphql");

var _main = __webpack_require__(/*! ./apolloServer/main */ "./src/apolloServer/main.js");

var _graphqlTools = __webpack_require__(/*! graphql-tools */ "graphql-tools");

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var utils = _interopRequireWildcard(_utils);

var _ws = __webpack_require__(/*! ws */ "ws");

var _ws2 = _interopRequireDefault(_ws);

var _apolloClientPreset = __webpack_require__(/*! apollo-client-preset */ "apollo-client-preset");

var _apolloUtilities = __webpack_require__(/*! apollo-utilities */ "apollo-utilities");

var _subscriptionsTransportWs = __webpack_require__(/*! subscriptions-transport-ws */ "subscriptions-transport-ws");

var _graphqlSubscriptions = __webpack_require__(/*! graphql-subscriptions */ "graphql-subscriptions");

var _nodeFetch = __webpack_require__(/*! node-fetch */ "node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _apolloLinkHttp = __webpack_require__(/*! apollo-link-http */ "apollo-link-http");

var _objectFactories = __webpack_require__(/*! ./objectFactories */ "./src/objectFactories.js");

var factories = _interopRequireWildcard(_objectFactories);

var _registerRouters = __webpack_require__(/*! ./registerRouters */ "./src/registerRouters.js");

var _registerRouters2 = _interopRequireDefault(_registerRouters);

var _openApi = __webpack_require__(/*! ./http/openApi */ "./src/http/openApi.js");

var _bodyParser = __webpack_require__(/*! body-parser */ "body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = __webpack_require__(/*! http */ "http");

var _http2 = _interopRequireDefault(_http);

var _fs = __webpack_require__(/*! fs */ "fs");

var _fs2 = _interopRequireDefault(_fs);

var _treeify = __webpack_require__(/*! treeify */ "treeify");

var _treeify2 = _interopRequireDefault(_treeify);

var _superstruct = __webpack_require__(/*! superstruct */ "superstruct");

var _eventemitter = __webpack_require__(/*! eventemitter2 */ "eventemitter2");

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _bluebird = __webpack_require__(/*! bluebird */ "bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _jsonToPrettyYaml = __webpack_require__(/*! json-to-pretty-yaml */ "json-to-pretty-yaml");

var _printMessage = __webpack_require__(/*! print-message */ "print-message");

var _printMessage2 = _interopRequireDefault(_printMessage);

var _os = __webpack_require__(/*! os */ "os");

var _os2 = _interopRequireDefault(_os);

var _socket = __webpack_require__(/*! socket.io */ "socket.io");

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var httpDependencies = {
  RouterCreator: _router2.default,
  PathCreator: _path2.default,
  defaultHandler: _defaultHandler2.default,
  CreateHandler: _handler2.default,
  request: _request2.default,
  response: _response2.default,
  midHandler: _middlewareHandler2.default,
  pathDescribe: _openApi.pathDescribe,
  mainDescribe: _openApi.mainDescribe,
  schemas: _openApi.schemas
};

var graphqlDependencies = {
  GraphQlCreator: _graphQlSchema2.default,
  graphqlExpress: _main.graphqlExpress,
  graphiqlExpress: _main.graphiqlExpress,
  graphqlHandler: _graphQlHandler2.default,
  SubscriptionServer: _subscriptionsTransportWs.SubscriptionServer,
  execute: _graphql.execute,
  subscribe: _graphql.subscribe,
  PubSub: _graphqlSubscriptions.PubSub,
  mergeSchemas: _graphqlTools.mergeSchemas,
  makeRemoteExecutableSchema: _graphqlTools.makeRemoteExecutableSchema,
  getIntrospectSchema: _utils.getIntrospectSchema,
  fetch: _nodeFetch2.default,
  introspectSchema: _graphqlTools.introspectSchema,
  createHttpLink: _apolloLinkHttp.createHttpLink,
  HttpLink: _apolloLinkHttp.HttpLink,
  SubscriptionClient: _subscriptionsTransportWs.SubscriptionClient,
  ws: _ws2.default,
  getMainDefinition: _apolloUtilities.getMainDefinition,
  split: _apolloClientPreset.split,
  SchemaDirectiveVisitor: _graphqlTools.SchemaDirectiveVisitor,
  GraphQLScalarType: _graphql.GraphQLScalarType,
  GraphQLNonNull: _graphql.GraphQLNonNull,
  defaultFieldResolver: _graphql.defaultFieldResolver,
  GraphQLString: _graphql.GraphQLString
};

var socketDependencies = {
  SocketListenerCreator: _socketListener2.default,
  SocketRouterCreator: _socketRouter2.default,
  socketMiddlewareHandler: _middlewareHandler.socketMiddlewareHandler,
  socketHandler: _socketHandler2.default
};

var superStructObject = {
  struct: _superstruct.struct,
  superstruct: _superstruct.superstruct,
  StructError: _superstruct.StructError
};

var appDependencies = {
  bodyParser: _bodyParser2.default,
  http: _http2.default,
  io: _socket2.default,
  makeExecutableSchema: _graphqlTools.makeExecutableSchema,
  fs: _fs2.default,
  treeify: _treeify2.default,
  EventEmitter: _eventemitter2.default,
  Promise: _bluebird2.default,
  stringify: _jsonToPrettyYaml.stringify,
  print: _printMessage2.default,
  os: _os2.default,
  packgeJson: _package2.default,
  RegisterRouters: _registerRouters2.default

  // combining all dependencies to one object for convenience.
};var BlizAppParams = _extends({}, utils, factories, httpDependencies, graphqlDependencies, socketDependencies, appDependencies, {
  superStructObject: superStructObject

  // main instance creator, returns an instance of bliz app
  // using concatanative inheritance + RORO (receive object return object)
});var BlizApp = function BlizApp(BlizAppParams) {
  // internal information
  // _Instance - all instance data
  // _injected - all data passed, will be injected to all handlers
  // _options - options object, still did not implement anything for it
  // _loggerEntity - holds the structure of sockets and http routes when calling pretty print
  var _internal = {
    _version: BlizAppParams.packgeJson.version,
    _Instance: {},
    _injected: {},
    _options: {},
    _loggerEntity: { sockets: {}, http: {} }
    // socekt.io object, _socketSubApps was not yet implemented
  };var _useSockets = {
    useSockets: false,
    delimiter: ':',
    _socketRoutersObject: {},
    _socketMiddlewares: [],
    _socketSubApps: []
    // graphql config object
  };var _useGraphql = {
    useGraphql: false,
    graphqlRoute: '/graphql',
    graphiqlRoute: '/graphiql',
    _graphQlRemoteEndpoints: [],
    _graphQlExecutableSchema: null,
    _graphQlSchemas: {},
    _graphQlDirectives: [],
    _graphQlEnums: [],
    subscriptionsEndpoint: '/subscriptions',
    useGraphiql: true,
    logger: { log: function log(e) {
        return console.log('Error from graphql: ', e);
      } },
    directiveResolvers: {},
    tracing: true,
    cacheControl: {
      defaultMaxAge: 5
    }
    // http object, _describe is added by each component as .describe, used for swagger.yaml generation
  };var _useHttp = {
    useSwagger: false,
    _middleWares: [],
    _routersObject: {},
    _describe: {},
    _subApps: []

    // entire app data, used when calling getObjProps() on app
  };var _appData = {
    _useSockets: _useSockets,
    _useGraphql: _useGraphql,
    _useHttp: _useHttp

    // binding all data and dependencies to the http handler
  };var _createHandler = _handler2.default.bind(undefined, _extends({}, BlizAppParams, _useHttp));
  // destructuring for passing to allow chaining on methods
  var _Instance = _internal._Instance,
      _options = _internal._options,
      _injected = _internal._injected,
      _loggerEntity = _internal._loggerEntity,
      _version = _internal._version;

  // call all function and pass dependencies to them and compose methods, put all on the Instance object

  return Object.assign(_Instance, BlizAppParams.CreateNewObjOf({ name: 'GraphQlSchema', obj: _graphQlSchema2.default }), BlizAppParams.CreateNewObjOf({
    name: 'SocketRouter',
    obj: _socketRouter2.default,
    dependencies: _extends({}, BlizAppParams)
  }), BlizAppParams.CreateNewObjOf({
    name: 'SocketListener',
    obj: _socketListener2.default,
    dependencies: _extends({}, BlizAppParams)
  }), BlizAppParams.CreateNewObjOf({
    name: 'Router',
    obj: _router2.default,
    dependencies: _extends({}, BlizAppParams)
  }), BlizAppParams.CreateNewObjOf({
    name: 'Path',
    obj: _path2.default,
    dependencies: _extends({}, BlizAppParams)
  }), BlizAppParams.AssignHandler({
    name: 'sockets',
    obj: _useSockets,
    chainLink: _Instance,
    override: true
  }), BlizAppParams.AssignHandler({
    name: 'graphql',
    obj: _useGraphql,
    chainLink: _Instance,
    override: true
  }), BlizAppParams.AssignHandler({
    name: 'describe',
    obj: _useHttp._describe,
    chainLink: _Instance,
    override: true
  }), BlizAppParams.AssignHandler({
    name: 'options',
    obj: _options,
    chainLink: _Instance,
    override: true
  }), BlizAppParams.AssignHandler({
    name: 'inject',
    obj: _injected,
    chainLink: _Instance,
    override: true
  }), BlizAppParams.CreateObjectArray({
    name: 'middleware',
    arr: _useHttp._middleWares,
    chainLink: _Instance
  }), BlizAppParams.CreateObjectArray({
    name: 'socketMiddleware',
    arr: _useSockets._socketMiddlewares,
    chainLink: _Instance
  }), BlizAppParams.CreateArray({ name: 'subApp', arr: _useHttp._subApps, chainLink: _Instance }), BlizAppParams.CreateArray({
    name: 'enum',
    arr: _useGraphql._graphQlEnums,
    chainLink: _Instance
  }), BlizAppParams.CreateArray({
    name: 'directive',
    arr: _useGraphql._graphQlDirectives,
    chainLink: _Instance
  }), BlizAppParams.CreateSwagger(_extends({}, _appData, BlizAppParams, { _Instance: _Instance })), BlizAppParams.PrettyPrint(_extends({}, _appData, BlizAppParams, { _Instance: _Instance, _loggerEntity: _loggerEntity })), BlizAppParams.RegisterRouters(_extends({}, _appData, BlizAppParams, { _Instance: _Instance })), BlizAppParams.EventsCreator(BlizAppParams.EventEmitter), BlizAppParams.GetObjProps(_appData), BlizAppParams.Listen(_extends({
    _createHandler: _createHandler
  }, _appData, BlizAppParams, {
    _Instance: _Instance,
    _version: _version,
    _injected: _injected
  })));
};

// exposed factory to create a new instance
var BlizCreator = function BlizCreator() {
  return Object.assign({}, BlizApp(BlizAppParams));
};

// expose factory and superstruct for validation, request + response for extending http req and res
exports.default = BlizCreator;
exports.request = _request2.default;
exports.response = _response2.default;
exports.struct = _superstruct.struct;
exports.superstruct = _superstruct.superstruct;
exports.StructError = _superstruct.StructError;
exports.SchemaDirectiveVisitor = _graphqlTools.SchemaDirectiveVisitor;

/***/ }),

/***/ "./src/middlewareHandler.js":
/*!**********************************!*\
  !*** ./src/middlewareHandler.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

// handler for express middlewares with next...
var midHandler = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(Promise, req, res, arr) {
    var _this = this;

    var _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

    return regeneratorRuntime.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(item) {
              var fn, timeout, throwError, handlerPromise, data;
              return regeneratorRuntime.wrap(function _loop$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      fn = item.fn, timeout = item.timeout, throwError = item.throwError;
                      handlerPromise = new Promise(function (resolve, reject) {
                        return fn(req, res, next.bind(_this, resolve, reject));
                      });
                      _context.next = 4;
                      return promiseTimeout(handlerPromise, timeout, throwError);

                    case 4:
                      data = _context.sent;

                    case 5:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _loop, _this);
            });
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 4;
            _iterator = arr[Symbol.iterator]();

          case 6:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 12;
              break;
            }

            item = _step.value;
            return _context2.delegateYield(_loop(item), 't0', 9);

          case 9:
            _iteratorNormalCompletion = true;
            _context2.next = 6;
            break;

          case 12:
            _context2.next = 18;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t1 = _context2['catch'](4);
            _didIteratorError = true;
            _iteratorError = _context2.t1;

          case 18:
            _context2.prev = 18;
            _context2.prev = 19;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 21:
            _context2.prev = 21;

            if (!_didIteratorError) {
              _context2.next = 24;
              break;
            }

            throw _iteratorError;

          case 24:
            return _context2.finish(21);

          case 25:
            return _context2.finish(18);

          case 26:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee, this, [[4, 14, 18, 26], [19,, 21, 25]]);
  }));

  return function midHandler(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

// handler for socket middlewares with next


var socketMiddlewareHandler = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(Promise, io, socket, msg, cb, arr) {
    var _this2 = this;

    var _loop2, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item;

    return regeneratorRuntime.wrap(function _callee2$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _loop2 = /*#__PURE__*/regeneratorRuntime.mark(function _loop2(item) {
              var fn, timeout, throwError, handlerPromise;
              return regeneratorRuntime.wrap(function _loop2$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      fn = item.fn, timeout = item.timeout, throwError = item.throwError;
                      handlerPromise = new Promise(function (resolve, reject) {
                        return fn(io, socket, msg, cb, next.bind(_this2, resolve, reject));
                      });
                      _context3.next = 4;
                      return promiseTimeout(handlerPromise, timeout, throwError);

                    case 4:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, _loop2, _this2);
            });

            // run on middleware array and wait for each sequentially
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context4.prev = 4;
            _iterator2 = arr[Symbol.iterator]();

          case 6:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context4.next = 12;
              break;
            }

            item = _step2.value;
            return _context4.delegateYield(_loop2(item), 't0', 9);

          case 9:
            _iteratorNormalCompletion2 = true;
            _context4.next = 6;
            break;

          case 12:
            _context4.next = 18;
            break;

          case 14:
            _context4.prev = 14;
            _context4.t1 = _context4['catch'](4);
            _didIteratorError2 = true;
            _iteratorError2 = _context4.t1;

          case 18:
            _context4.prev = 18;
            _context4.prev = 19;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 21:
            _context4.prev = 21;

            if (!_didIteratorError2) {
              _context4.next = 24;
              break;
            }

            throw _iteratorError2;

          case 24:
            return _context4.finish(21);

          case 25:
            return _context4.finish(18);

          case 26:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee2, this, [[4, 14, 18, 26], [19,, 21, 25]]);
  }));

  return function socketMiddlewareHandler(_x5, _x6, _x7, _x8, _x9, _x10) {
    return _ref2.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// next function that resolves if called next(), if next is called with args it rejects, like in express
function next(resolve, reject) {
  if ((arguments.length <= 2 ? 0 : arguments.length - 2) > 0) return reject(arguments.length <= 2 ? undefined : arguments[2]);
  return resolve();
}

// race the timeout promise with the promise provided, used to timeout the middlewares
var promiseTimeout = function promiseTimeout(promise, ms, throwError) {
  // Create a promise that rejects in <ms> milliseconds
  var timeout = new Promise(function (resolve, reject) {
    var id = setTimeout(function () {
      clearTimeout(id);
      var err = new Error('Timed out in ' + ms + 'ms.');
      throwError ? reject(err) : resolve('Timed out in ' + ms + 'ms.');
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeout]);
};exports.socketMiddlewareHandler = socketMiddlewareHandler;
exports.default = midHandler;

/***/ }),

/***/ "./src/objectFactories.js":
/*!********************************!*\
  !*** ./src/objectFactories.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// receive an http and a handler and return a listen func
var Listen = function Listen(dependencies) {
  return {
    createServer: function createServer() {
      var createServer = dependencies.http.createServer,
          _createHandler = dependencies._createHandler;

      var _createHandler2 = _createHandler(),
          handler = _createHandler2.handler;

      var server = createServer(handler);
      return server;
    },
    // listen function that starts the app
    // if sockets -> use socket handler
    // else if graphql -> use graphql handler
    // else -> use http handler
    // on each handler fire log event, used to notify log listener to log after all routes and middlewares have been processed and app is ready.
    listen: function listen() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var createServer = dependencies.http.createServer,
          io = dependencies.io,
          socketHandler = dependencies.socketHandler,
          graphqlHandler = dependencies.graphqlHandler,
          _createHandler = dependencies._createHandler,
          _useSockets = dependencies._useSockets,
          _version = dependencies._version,
          _useGraphql = dependencies._useGraphql,
          _Instance = dependencies._Instance,
          print = dependencies.print,
          os = dependencies.os;

      var _createHandler3 = _createHandler(),
          handler = _createHandler3.handler;

      var server = createServer(handler);
      if (_useSockets.useSockets) {
        _useSockets.io = io;
        return socketHandler(_extends({ server: server, args: args }, dependencies));
      } else if (_useGraphql.useGraphql) {
        return graphqlHandler(_extends({ server: server, args: args }, dependencies));
      } else {
        _Instance.events.emit('log');
        if (args.length > 1) {
          return server.listen.apply(server, args);
        } else {
          // print os information and Bliz information
          return server.listen.apply(server, [args[0], function () {
            return print(['Listening on Bliz server ' + _version + ' on port ' + args[0], 'Platform: ' + os.platform(), 'Hostname: ' + os.hostname(), 'Architecture: ' + os.arch(), 'CPU Cores: ' + os.cpus().length, 'Memory Free: ' + (os.freemem() / os.totalmem() * 100).toFixed(0) + '%, ' + (os.freemem() / 1024 / 1024).toFixed(0) + ' MB / ' + (os.totalmem() / 1024 / 1024).toFixed(0) + ' MB']);
          }]);
        }
      }
    }
  };
};

// TODO: implement cluster support on sockets
var Cluster = function Cluster(_ref) {
  var _version = _ref._version;
  return {
    // stage 1
    // get options
    // get routers, schemas
    // open redis client
    // ask redis for bliz cluster version
    // if same version - continue
    // else - different versions between cluster servers, throw error (update server)
    // stage 2
    // create server hash
    // write hash to redis
    // stage 3
    // open redis subscriber for divide work
    // open redis subscriber for receive work
    // stage 4
    // when query comes, round robin or options to choose random server (subscribers / hash ??)
    // fire divide work event to chosen server
    // if chosen master
    // divide work totalSchemas / registered servers on cluster
  };
};

// pretty print all app routes
var PrettyPrint = function PrettyPrint(_ref2) {
  var _useHttp = _ref2._useHttp,
      _useSockets = _ref2._useSockets,
      _Instance = _ref2._Instance,
      _loggerEntity = _ref2._loggerEntity,
      populateObjectWithTreeUtil = _ref2.populateObjectWithTreeUtil,
      treeify = _ref2.treeify;
  return {
    prettyPrint: function prettyPrint() {
      var logger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : console.log;

      _Instance.events.once('log', function () {
        return setImmediate(function () {
          populateObjectWithTreeUtil(_useHttp._routersObject, ['get', 'post', 'put', 'del'], _loggerEntity.http);
          populateObjectWithTreeUtil(_useSockets._socketRoutersObject, ['event'], _loggerEntity.sockets, _useSockets.delimiter);
          logger(treeify.asTree(_loggerEntity));
        }, 0);
      });
      return _Instance;
    }
  };
};

// method creator for router
var Method = function Method(name, object, chainLink) {
  return _defineProperty({}, name, function (data) {
    object[name][data.getObjProps().path] = data;
    return chainLink;
  });
};

// create swagger yaml
// run on all routers and describe blocks and assemble swagger.yaml
// mainDescribe -> takes info from app.describe()
// pathDescribe -> takes info from path.describe()
var CreateSwagger = function CreateSwagger(_ref4) {
  var _useHttp = _ref4._useHttp,
      _Instance = _ref4._Instance,
      stringify = _ref4.stringify,
      mainDescribe = _ref4.mainDescribe,
      _describe = _ref4._describe,
      pathDescribe = _ref4.pathDescribe,
      schemas = _ref4.schemas,
      fs = _ref4.fs;
  return {
    swagger: function swagger(swaggerOptions) {
      var yaml = '';
      _useHttp.swagger = true;
      var _routersObject = _useHttp._routersObject,
          _describe = _useHttp._describe;

      yaml += stringify(mainDescribe(_describe));
      var routersKeys = Object.keys(_routersObject);
      var mainPathsObject = { paths: {} };
      var schemasObject = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = routersKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          var options = ['get', 'post', 'put', 'del'];
          var router = _routersObject[key];

          var _loop = function _loop(method) {
            var paths = Object.keys(router[method]);

            var _loop2 = function _loop2(path) {
              var fullPath = router.base + path;
              var describe = router[method][path].getObjProps().describe;
              var responseObjectsForSchema = describe.incoming.filter(function (request) {
                return request.in === 'body';
              });
              if (responseObjectsForSchema.length > 0) {
                responseObjectsForSchema.map(function (response) {
                  var obj = {};
                  var name = fullPath.replace(/\//g, '').replace(/-/, '').replace(/[:]/g, '') + '-body-' + method;
                  obj.name = name;
                  // obj.department = 'requestBodies'
                  obj.schema = Object.assign({}, response.schema);
                  schemasObject.push(obj);
                });
              }
              describe.outgoing.map(function (response) {
                var obj = {};
                var name = fullPath.replace(/\//g, '').replace(/-/, '').replace(/[{:}]/g, '') + '-' + response.status + '-' + method;
                obj.name = name;
                // obj.department = 'responses'
                obj.schema = Object.assign({}, response.schema);
                schemasObject.push(obj);
              });

              var fullObj = Object.assign({}, describe, { method: method, path: fullPath });
              Object.assign(mainPathsObject.paths, pathDescribe(fullObj));
            };

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = paths[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var path = _step3.value;

                _loop2(path);
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          };

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = options[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var method = _step2.value;

              _loop(method);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          yaml += stringify(mainPathsObject);
          yaml += stringify(schemas(schemasObject));
          // console.log(yaml)
          // console.log(swaggerOptions)
          if (swaggerOptions && swaggerOptions.absoluteFilePath) {
            fs.writeFileSync(swaggerOptions.absoluteFilePath, yaml, 'utf8');
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return _Instance;
    }
  };
};

// assign creator
var AssignHandler = function AssignHandler(_ref5) {
  var name = _ref5.name,
      obj = _ref5.obj,
      chainLink = _ref5.chainLink,
      _ref5$override = _ref5.override,
      override = _ref5$override === undefined ? false : _ref5$override;
  return _defineProperty({}, name, function (data) {
    override ? Object.assign(obj, data) : obj[name] = data;
    // console.log(`DATA AFTER: `, object, name, data)
    return chainLink;
  });
};

// list object properties
var GetObjProps = function GetObjProps(obj) {
  return {
    getObjProps: function getObjProps() {
      return obj;
    }
  };
};

// create event emmiter 2 instance (supports regexes)
var EventsCreator = function EventsCreator(EventEmitter) {
  return {
    events: new EventEmitter({ wildcard: true })
  };
};

// when called, receives an object
// returns new object
var CreateNewObjOf = function CreateNewObjOf(_ref7) {
  var name = _ref7.name,
      obj = _ref7.obj,
      _ref7$dependencies = _ref7.dependencies,
      dependencies = _ref7$dependencies === undefined ? {} : _ref7$dependencies;
  return _defineProperty({}, 'create' + name, function undefined(data) {
    return Object.assign({}, obj.apply(undefined, [data].concat(_toConsumableArray(dependencies))));
  });
};

// pushes data to array
var CreateArray = function CreateArray(_ref9) {
  var name = _ref9.name,
      arr = _ref9.arr,
      chainLink = _ref9.chainLink;
  return _defineProperty({}, name, function (data) {
    arr.push(data);
    return chainLink;
  });
};

// pushes data to middleware array with default timeout of 5s and throwError set to true if timeout occures
var CreateObjectArray = function CreateObjectArray(_ref11) {
  var name = _ref11.name,
      arr = _ref11.arr,
      chainLink = _ref11.chainLink;
  return _defineProperty({}, name, function (fn) {
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;
    var throwError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    arr.push({ fn: fn, timeout: timeout, throwError: throwError });
    return chainLink;
  });
};

exports.AssignHandler = AssignHandler;
exports.CreateArray = CreateArray;
exports.CreateNewObjOf = CreateNewObjOf;
exports.Method = Method;
exports.GetObjProps = GetObjProps;
exports.Listen = Listen;
exports.PrettyPrint = PrettyPrint;
exports.EventsCreator = EventsCreator;
exports.CreateSwagger = CreateSwagger;
exports.CreateObjectArray = CreateObjectArray;

/***/ }),

/***/ "./src/registerRouters.js":
/*!********************************!*\
  !*** ./src/registerRouters.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// register routers func, returns 3 register routers methods, one for http, one for sockets and last one for graphql
var RegisterRouters = function RegisterRouters(_ref) {
  var _useGraphql = _ref._useGraphql,
      _useHttp = _ref._useHttp,
      _injected = _ref._injected,
      _useSockets = _ref._useSockets,
      _Instance = _ref._Instance,
      populateSubAppsUtil = _ref.populateSubAppsUtil,
      populateRoutersUtil = _ref.populateRoutersUtil,
      populateSocketRoutersUtil = _ref.populateSocketRoutersUtil;
  return {
    registerRouters: function registerRouters() {
      for (var _len = arguments.length, routers = Array(_len), _key = 0; _key < _len; _key++) {
        routers[_key] = arguments[_key];
      }

      // populate subApps object with sub apps passed
      var _middleWares = _useHttp._middleWares,
          _routersObject = _useHttp._routersObject,
          _subApps = _useHttp._subApps;

      populateSubAppsUtil(_middleWares, _routersObject, _subApps);
      // populate globalRoutesObject with routers passed
      populateRoutersUtil(_routersObject, routers);
      return _Instance;
    },
    registerSocketRouters: function registerSocketRouters() {
      for (var _len2 = arguments.length, routers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        routers[_key2] = arguments[_key2];
      }

      // console.log(routers)
      // TODO: add sub apps socket routers
      var _socketRoutersObject = _useSockets._socketRoutersObject;
      var delimiter = _useSockets.delimiter;

      populateSocketRoutersUtil(_socketRoutersObject, routers, null, delimiter);
      // console.log(_socketRoutersObject)
      return _Instance;
    },
    registerGraphQlSchemas: function registerGraphQlSchemas() {
      for (var _len3 = arguments.length, schemas = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        schemas[_key3] = arguments[_key3];
      }

      // if remote endpoints set, do not allow local schemas to be registered
      var _graphQlRemoteEndpoints = _useGraphql._graphQlRemoteEndpoints;

      if (_graphQlRemoteEndpoints.length > 0) {
        throw new Error('you may only registerGraphQlSchemas or registerRemoteGraphQlSchemas, not either');
      } else {
        Object.assign(_useGraphql._graphQlSchemas, { schemas: schemas });
      }
      return _Instance;
    },
    registerRemoteGraphQlSchemas: function registerRemoteGraphQlSchemas() {
      for (var _len4 = arguments.length, endpoints = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        endpoints[_key4] = arguments[_key4];
      }

      // if local endpoints set, do not allow remote schemas to be registered
      if (Object.keys(_useGraphql._graphQlSchemas).length > 0) {
        throw new Error('you may only registerGraphQlSchemas or registerRemoteGraphQlSchemas, not either');
      } else {
        _useGraphql._graphQlRemoteEndpoints = endpoints;
        // console.log(endpoints)
      }
      return _Instance;
    }
  };
};
exports.default = RegisterRouters;

/***/ }),

/***/ "./src/sockets/socketHandler.js":
/*!**************************************!*\
  !*** ./src/sockets/socketHandler.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// socket handler, called from listen when use sockets is set to true
var socketHandler = function socketHandler(_ref) {
  var _useSockets = _ref._useSockets,
      _Instance = _ref._Instance,
      _injected = _ref._injected,
      server = _ref.server,
      _version = _ref._version,
      args = _ref.args,
      os = _ref.os,
      print = _ref.print,
      socketMiddlewareHandler = _ref.socketMiddlewareHandler,
      checkSubRouters = _ref.checkSubRouters;

  var injectedIo = _useSockets.io(server);
  if (args.length > 1) {
    server.listen.apply(server, args);
  } else {
    server.listen.apply(server, [args[0], function () {
      return print(['Listening on Bliz server ' + _version + ' on port ' + args[0], 'Platform: ' + os.platform(), 'Hostname: ' + os.hostname(), 'Architecture: ' + os.arch(), 'CPU Cores: ' + os.cpus().length, 'Memory Free: ' + (os.freemem() / 1024 / 1024 / (os.totalmem() / 1024 / 1024) * 100).toFixed(0) + '%, ' + (os.freemem() / 1024 / 1024).toFixed(0) + ' MB / ' + (os.totalmem() / 1024 / 1024).toFixed(0) + ' MB']);
    }]);
  }

  // on connection add all routers and middlewares
  injectedIo.on('connection', function (socket) {
    var routersKeys = Object.keys(_useSockets._socketRoutersObject);

    var _loop = function _loop(key) {
      var eventKeys = Object.keys(_useSockets._socketRoutersObject[key].event);

      var _loop2 = function _loop2(eventKey) {
        socket.on('' + key + _useSockets.delimiter + eventKey, function () {
          var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(msg, cb) {
            var chosenEvent, combinedMiddlewareArray;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;
                    chosenEvent = _useSockets._socketRoutersObject[key].event[eventKey].getObjProps();

                    if (!(_useSockets._socketMiddlewares && _useSockets._socketMiddlewares.length > 0)) {
                      _context.next = 5;
                      break;
                    }

                    _context.next = 5;
                    return socketMiddlewareHandler(Promise, injectedIo, socket, msg, cb, _useSockets._socketMiddlewares);

                  case 5:
                    combinedMiddlewareArray = [];

                    key.split(_useSockets.delimiter).map(function (prefix) {
                      return _useSockets._socketRoutersObject[prefix] ? checkSubRouters(_useSockets._socketRoutersObject[prefix], combinedMiddlewareArray) : void 0;
                    });

                    combinedMiddlewareArray = combinedMiddlewareArray.reduce(function (prev, curr) {
                      return prev.concat(curr);
                    });

                    if (!(combinedMiddlewareArray && combinedMiddlewareArray.length > 0)) {
                      _context.next = 11;
                      break;
                    }

                    _context.next = 11;
                    return socketMiddlewareHandler(Promise, injectedIo, socket, msg, cb, combinedMiddlewareArray);

                  case 11:
                    if (!(chosenEvent.middleWareArr && chosenEvent.middleWareArr.length > 0)) {
                      _context.next = 14;
                      break;
                    }

                    _context.next = 14;
                    return socketMiddlewareHandler(Promise, injectedIo, socket, msg, cb, chosenEvent.middleWareArr);

                  case 14:
                    _context.next = 16;
                    return chosenEvent.handler(injectedIo, socket, msg, cb, _injected);

                  case 16:
                    _context.next = 21;
                    break;

                  case 18:
                    _context.prev = 18;
                    _context.t0 = _context['catch'](0);

                    console.log(_context.t0);

                  case 21:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, undefined, [[0, 18]]);
          }));

          return function (_x, _x2) {
            return _ref2.apply(this, arguments);
          };
        }());
      };

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = eventKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var eventKey = _step2.value;

          _loop2(eventKey);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = routersKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        _loop(key);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    socket.on('disconnect', function () {});
  });
  _Instance.events.emit('log');
  return injectedIo;
};

exports.default = socketHandler;

/***/ }),

/***/ "./src/sockets/socketListener.js":
/*!***************************************!*\
  !*** ./src/sockets/socketListener.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectFactories = __webpack_require__(/*! ../objectFactories */ "./src/objectFactories.js");

// socket listener creator
var CreateSocketListener = function CreateSocketListener(path) {
  var _PathReturn = {};
  var pathData = {
    middleWareArr: [],
    path: path,
    handler: null,
    errHandler: null
  };
  return Object.assign(_PathReturn, (0, _objectFactories.CreateObjectArray)({ name: 'middleware', arr: pathData.middleWareArr, chainLink: _PathReturn }), (0, _objectFactories.AssignHandler)({ name: 'handler', obj: pathData, chainLink: _PathReturn }), (0, _objectFactories.AssignHandler)({ name: 'errHandler', obj: pathData, chainLink: _PathReturn }), (0, _objectFactories.GetObjProps)(pathData));
};

exports.default = CreateSocketListener;

/***/ }),

/***/ "./src/sockets/socketRouter.js":
/*!*************************************!*\
  !*** ./src/sockets/socketRouter.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectFactories = __webpack_require__(/*! ../objectFactories */ "./src/objectFactories.js");

// socket router creator
var SocketRouterCreator = function SocketRouterCreator(base) {
  var _RouterReturn = {};
  var routerData = {
    base: base,
    event: {},
    middleWareArr: [],
    subRouters: [],
    routerErrorHandler: null
  };
  return Object.assign(_RouterReturn, (0, _objectFactories.Method)('event', routerData, _RouterReturn), (0, _objectFactories.AssignHandler)({ name: 'routerErrorHandler', obj: routerData, chainLink: _RouterReturn }), (0, _objectFactories.CreateObjectArray)({
    name: 'middleware',
    arr: routerData.middleWareArr,
    chainLink: _RouterReturn
  }), (0, _objectFactories.CreateArray)({ name: 'socketSubRouter', arr: routerData.subRouters, chainLink: _RouterReturn }), (0, _objectFactories.GetObjProps)(routerData));
};

exports.default = SocketRouterCreator;

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// check url, split by /, return split url and method to lower case
var urlUtil = function urlUtil(url, methodUpperCase) {
  var dividedUrl = url.split('/');
  var method = methodUpperCase.toLowerCase();
  if (method === 'delete') method = 'del';
  var splitRest = dividedUrl.slice(1).map(function (each) {
    return '/' + each;
  });
  splitRest.unshift('/');
  splitRest = checkBaseUtil(splitRest);
  return {
    method: method,
    splitRest: splitRest
  };
};

// get remote schemas for schema stitching with graphql
var getIntrospectSchema = function getIntrospectSchema(_ref) {
  var HttpLink = _ref.HttpLink,
      SubscriptionClient = _ref.SubscriptionClient,
      fetch = _ref.fetch,
      ws = _ref.ws,
      getMainDefinition = _ref.getMainDefinition,
      split = _ref.split,
      introspectSchema = _ref.introspectSchema,
      makeRemoteExecutableSchema = _ref.makeRemoteExecutableSchema;
  return function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(remoteSchema) {
      var httpLink, wsLink, link, schema, executableSchema;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              httpLink = new HttpLink({ uri: remoteSchema.url, fetch: fetch });
              wsLink = new SubscriptionClient(remoteSchema.ws, {
                reconnect: true
              }, ws);
              link = split(function (_ref3) {
                var query = _ref3.query;

                var _getMainDefinition = getMainDefinition(query),
                    kind = _getMainDefinition.kind,
                    operation = _getMainDefinition.operation;

                return kind === 'OperationDefinition' && operation === 'subscription';
              }, wsLink, httpLink);
              _context.next = 5;
              return introspectSchema(httpLink);

            case 5:
              schema = _context.sent;
              executableSchema = makeRemoteExecutableSchema({
                schema: schema,
                link: link
              });
              return _context.abrupt('return', executableSchema);

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }();
};

// used by pretty print to populate object with data received
var populateObjectWithTreeUtil = function populateObjectWithTreeUtil(entity, options, objectToAddTo, delimiter) {
  var keysOfEntity = Object.keys(entity);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keysOfEntity[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      var obj = {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = options[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var option = _step2.value;

          var routeValues = Object.keys(entity[key][option]);
          if (routeValues.length > 0) {
            var routeKey = delimiter || option.toUpperCase();
            var value = {};
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = routeValues[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var route = _step3.value;

                value[route] = '';
                var assignedOption = _defineProperty({}, '' + [routeKey], value);
                Object.assign(obj, assignedOption);
                objectToAddTo[key] = obj;
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

// recurse on routers object and populate obj passed
var populateSocketRoutersUtil = function populateSocketRoutersUtil(obj, routers) {
  var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var delimiter = arguments[3];

  // console.log(`obj: `, obj, `routers: `, routers, `parent: `, parent)
  var innerRouterObj = {};
  routers.map(function (router) {
    var list = router.getObjProps();
    innerRouterObj[parent ? '' + parent + delimiter + list.base : list.base] = list;
    // console.log(`inner object`, innerRouterObj)
    if (list.subRouters.length > 0) {
      return populateSocketRoutersUtil(obj, list.subRouters, parent ? parent += ':' + list.base : list.base, delimiter);
    }
  });
  Object.assign(obj, innerRouterObj);
};

// recurse on routers object and populate obj passed
var populateRoutersUtil = function populateRoutersUtil(obj, routers) {
  var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  // console.log(obj, routers, parent)
  var innerRouterObj = {};
  routers.map(function (router) {
    var list = router.getObjProps();
    innerRouterObj[parent ? ('' + parent + list.base).replace('//', '/') : list.base] = list;
    if (list.subRouters.length > 0) {
      return populateRoutersUtil(obj, list.subRouters, parent ? parent += list.base : list.base);
    }
  });
  Object.assign(obj, innerRouterObj);
};

// recurse on sub apps, populate routers and middlewares
var populateSubAppsUtil = function populateSubAppsUtil(mds, routes, subApps) {
  subApps.map(function (subApp) {
    var data = subApp.getObjProps();
    var _middlewares = data._middleWares;
    var _routersObject = data._routersObject;
    Object.assign(routes, _routersObject);
    mds.push(_middlewares);
    var innerSubApps = data._subApps;
    if (innerSubApps.length > 0) {
      return populateSubAppsUtil(mds, routes, innerSubApps);
    }
  });
};

// nested routers handle test
var populateUrlOptions = function populateUrlOptions(arr) {
  var startStr = '';
  return arr.map(function (urlPart) {
    startStr += urlPart;
    startStr = startStr.replace('//', '/');
    return startStr;
  });
};

// run on split url receives and check each part of the url, if it is defined
var handleNestedRoutersUtil = function handleNestedRoutersUtil(splitUrl, routesObject) {
  var combinedRoutersMids = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var baseOfRequest = void 0;
  var rest = null;
  var lastDefinedRoute = null;
  // check each url in routes obj
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = splitUrl[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var url = _step4.value;

      // if exists, get middleware
      if (routesObject[url]) {
        lastDefinedRoute = url;
        combinedRoutersMids.push(routesObject[url].middleWareArr);
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  var indexOfLastRoute = splitUrl.indexOf(lastDefinedRoute);
  baseOfRequest = lastDefinedRoute;
  if (baseOfRequest) {
    if (indexOfLastRoute === splitUrl.length - 1) {
      rest = '/';
    } else {
      rest = splitUrl[splitUrl.length - 1];
      rest = rest.substr(baseOfRequest.length);
    }
    if (baseOfRequest === '/') {
      rest = '/' + rest;
    }
    rest = rest.replace('//', '/');
  } else {
    baseOfRequest = '/';
    rest = '/';
  }
  // console.log(`BASE:${baseOfRequest},REST:${rest},LASTURI:${lastDefinedRoute}`)
  // console.log(rest)
  combinedRoutersMids = combinedRoutersMids.reduce(function (prev, curr) {
    return prev.concat(curr);
  }, []);
  return {
    baseOfRequest: baseOfRequest,
    rest: rest,
    combinedRoutersMids: combinedRoutersMids
  };
};

// populate req.query from url
var populateQueryUtil = function populateQueryUtil(req, urlArray) {
  if (urlArray.includes('?')) {
    urlArray.substring(urlArray.indexOf('?') + 1).split('&').map(function (query) {
      var keyValue = query.split('=');
      req.query[keyValue[0]] = keyValue[1];
    });
    var urlToReturn = urlArray.substring(0, urlArray.indexOf('?'));
    return checkBaseUtil(urlToReturn);
  }
};

// if //, slice /
var checkBaseUtil = function checkBaseUtil(base) {
  var newBase = void 0;
  if (base[base.length - 1] === '/' && base.length > 1) {
    newBase = base.slice(0, base.length - 1);
  } else {
    newBase = base;
  }
  return newBase;
};

var checkSubRouters = function checkSubRouters(router) {
  var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  router = router.getObjProps ? router.getObjProps() : router;
  if (router.middleWareArr.length > 0) {
    array.push(router.middleWareArr);
  }
  if (router.subRouters.length > 0) {
    return router.subRouters.map(function (router) {
      return checkSubRouters(router, array);
    });
  }
};

// populate params util and replace params to match original route
var populateParamsUtil = function populateParamsUtil(req, routersObject, base, method, rest) {
  try {
    var param = void 0;
    var canSkipBecauseParams = false;
    if (rest === '/') {
      return { canSkipBecauseParams: canSkipBecauseParams, param: param };
    } else {
      var arr = Object.keys(routersObject[base][method]);
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = arr[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var path = _step5.value;

          var splitArr = path.split('/');
          var splitUrl = checkBaseUtil(rest).split('/');
          if (splitArr.length === splitUrl.length) {
            var counter = splitArr.length;
            var toBeCounted = 0;
            for (var i = 0, len = splitArr.length; i < len; i++) {
              if (splitArr[i].includes(':')) {
                toBeCounted += 1;
              } else if (splitArr[i] === splitUrl[i]) {
                toBeCounted += 1;
              }
            }
            if (toBeCounted === counter) {
              for (var _i = 0, _len = splitArr.length; _i < _len; _i++) {
                if (splitArr[_i].includes(':')) {
                  req.params[splitArr[_i].replace(':', '')] = splitUrl[_i];
                  canSkipBecauseParams = true;
                }
              }
              param = path;
            }
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return {
        param: param,
        canSkipBecauseParams: canSkipBecauseParams
      };
    }
  } catch (e) {
    return {
      param: null,
      canSkipBecauseParams: false
    };
  }
};

// assign nested object properties util
var assign = function assign(obj, keyPath, value) {
  var lastKeyIndex = keyPath.length - 1;
  for (var i = 0; i < lastKeyIndex; ++i) {
    var key = keyPath[i];
    if (!(key in obj)) obj[key] = {};
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
};

exports.urlUtil = urlUtil;
exports.populateRoutersUtil = populateRoutersUtil;
exports.populateUrlOptions = populateUrlOptions;
exports.handleNestedRoutersUtil = handleNestedRoutersUtil;
exports.populateSubAppsUtil = populateSubAppsUtil;
exports.checkBaseUtil = checkBaseUtil;
exports.populateObjectWithTreeUtil = populateObjectWithTreeUtil;
exports.populateQueryUtil = populateQueryUtil;
exports.populateParamsUtil = populateParamsUtil;
exports.populateSocketRoutersUtil = populateSocketRoutersUtil;
exports.checkSubRouters = checkSubRouters;
exports.getIntrospectSchema = getIntrospectSchema;
exports.assign = assign;

/***/ }),

/***/ "apollo-cache-control":
/*!***************************************!*\
  !*** external "apollo-cache-control" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-cache-control");

/***/ }),

/***/ "apollo-client-preset":
/*!***************************************!*\
  !*** external "apollo-client-preset" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-client-preset");

/***/ }),

/***/ "apollo-link-http":
/*!***********************************!*\
  !*** external "apollo-link-http" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-link-http");

/***/ }),

/***/ "apollo-server-module-graphiql":
/*!************************************************!*\
  !*** external "apollo-server-module-graphiql" ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-module-graphiql");

/***/ }),

/***/ "apollo-tracing":
/*!*********************************!*\
  !*** external "apollo-tracing" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-tracing");

/***/ }),

/***/ "apollo-utilities":
/*!***********************************!*\
  !*** external "apollo-utilities" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-utilities");

/***/ }),

/***/ "babel-polyfill":
/*!*********************************!*\
  !*** external "babel-polyfill" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),

/***/ "bluebird":
/*!***************************!*\
  !*** external "bluebird" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "etag":
/*!***********************!*\
  !*** external "etag" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("etag");

/***/ }),

/***/ "eventemitter2":
/*!********************************!*\
  !*** external "eventemitter2" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("eventemitter2");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "graphql":
/*!**************************!*\
  !*** external "graphql" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ }),

/***/ "graphql-extensions":
/*!*************************************!*\
  !*** external "graphql-extensions" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-extensions");

/***/ }),

/***/ "graphql-subscriptions":
/*!****************************************!*\
  !*** external "graphql-subscriptions" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-subscriptions");

/***/ }),

/***/ "graphql-tools":
/*!********************************!*\
  !*** external "graphql-tools" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-tools");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "json-to-pretty-yaml":
/*!**************************************!*\
  !*** external "json-to-pretty-yaml" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("json-to-pretty-yaml");

/***/ }),

/***/ "node-fetch":
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "print-message":
/*!********************************!*\
  !*** external "print-message" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("print-message");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),

/***/ "subscriptions-transport-ws":
/*!*********************************************!*\
  !*** external "subscriptions-transport-ws" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("subscriptions-transport-ws");

/***/ }),

/***/ "superstruct":
/*!******************************!*\
  !*** external "superstruct" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("superstruct");

/***/ }),

/***/ "treeify":
/*!**************************!*\
  !*** external "treeify" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("treeify");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ws");

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map