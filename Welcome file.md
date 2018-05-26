# Bliz ![Bliz](http://i63.tinypic.com/2cp5nye.png)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

  A fast, declarative framework for writing web servers, no taradiddles.
  Bliz allows you to write fast web servers with the blink of an eye, wether it is an http server, web sockets or graphql. Bliz supports the following features:
  
##### HTTP
 - Per route middlewares
 - Middleware timeouts (if a middleware was not completed in X seconds, continue or throw error)
 - Per route error handler
 - Enforces validation on incoming requests using [superstruct.js](https://github.com/ianstormtaylor/superstruct), a validation library.
 - Auto generates swagger file (**experimental**)
 - Pretty print all routes
##### Web Sockets (currently supports only ```socket.io```):
 - Written and used in the same concept as route (```socket.io``` event) => router (a group of ```socket.io``` events) => app (global)
 - Per event middlewares with optional timeouts
 - Pretty print all events
 - Automatic Cluster support with no configuration (**future**)
#####  Graph QL
 - Declarative schema creation with a simple function call
 - No need to combine schemas and resolvers, all will be done for you.
 - Integrated Graphiql for testing
