
# Bliz ![Bliz](http://i63.tinypic.com/2cp5nye.png)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![Generic badge](https://img.shields.io/badge/Contributions-Welcome-green.svg)](https://shields.io/) ![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)




  
## Basic Overview
A fast, declarative framework for writing web servers, no taradiddles.

Bliz allows you to write fast web servers with the blink of an eye, wether it is an http server, web sockets or graphql. Bliz supports the following features:

##### HTTP (implemented over Node's http module)
- Per route middlewares
- All middlewares are express like and support existing express middlewars
- Middleware timeouts (if a middleware was not completed in X seconds, continue or throw error)

- Per route error handler

- Enforces validation on incoming requests using [superstruct.js](https://github.com/ianstormtaylor/superstruct), a validation library.

- Auto generates swagger file (**experimental**)

- Pretty print all routes

##### Web Sockets (currently supports only ```socket.io```):

- Written and used in the same concept as route (```socket.io``` event) => router (a group of ```socket.io``` events) => app (global)

- Per event middlewares with optional timeouts

- Pretty print all events

##### Graph QL(uses graphql-tools and graphql)

- Declarative schema creation with a simple function call

- No need to combine schemas and resolvers, all will be done for you.

- Integrated Graphiql for testing
- Remote schema stitching built in.

# Table of contents
- [Installation](#installation)
-  [Usage](#usage)
	- [HTTP server](#http-server)
	- [Web Sockets](#web-sockets)
	- [Graphql](#graphql)
		- [Microservices With Remote Schema Stitching](#remote-schema-stitching)
- [Notes](#notes) 
- [Full Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

# Installation
```javascript
npm i -S bliz
or
yarn add bliz
```
[Back to top](#table-of-contents)

# Usage
```javascript 
import Bliz from 'bliz'
or
const Bliz = require('bliz)

const app = Bliz()
```
### Http Server
a Bliz http server consists of 3 parts: path, router, global app
let's see how to implement a simple http server.
```javascript 
// path.js
export default function examplePath (app) {
	app
	// creates a new http path
	.createPath('/example/path')
	// creates a handler for the path
	.handler((req, res) => {
		res.json({message: "This is so cool and simple!"})
	})
	// path middleware like in express
	.middleware((req, res, next)=>{
		console.log('hit /example/path!')
		next()
	})
	.errHandler((req, res, err)=>{
		console.log('my own custom error handler, so cool!!')
		// do some path specific error handling!
		res.json({error: err.message})
	})
}
```
```javascript 
// router.js
import examplePath from './path.js'
export default function router(app) {
	app
	.createRouter('/api')
	.get(examplePath(app))
	.middleware((req, res, next)=>{
		console.log('hit /api router and attached a path to it with very few lines of code!')
		next()
	})
	.errHandler((req, res, err)=>{ 
		console.log('router err handler, for when you do no have a path error handler' + 
		'but want a router to have all routes under it with special error handling !')  
		// do some path specific router error handling! 
		res.json({error: err.message})  
	})
}
```
```javascript 
// index.js
import Bliz from 'bliz'
import router from './router.js'
const app = Bliz()

app
.registerRouters(router(app))
.middleware((req, res, next)=> {// global middleware})
.listen(4000)
```
Writing this way is testable, modular and readable. 
Now fire a GET request to /api/example/path and enjoy.
[Back to top](#table-of-contents)
# Web Sockets
web sockets currently support and use socket.io behind the scenes.
web sockets are handled differently in Bliz, they work the same as an http server, meaning an event is like a path, a router is a namespace of events with a delimiter, and the app combines all routers. lets see how this works
```javascript 
// event.js
export default function exampleEvent(app) {
	app
	// creates a new socket listener
	.createSocketListener('event')
	// creates a handler for the event
	.handler((io, socket, msg, cb) => {
		// if emit fired you can cb to it immidietly
		// receive the msg and do something
	})
	// yes, yes, events have middlewares as well, because why not ??? 
	// abstraction usually helps readability
	.middleware((io, socket, msg, cb, next)=>{
		console.log('hit event')
		next()
	})
}
```
```javascript 
// events-router.js
import exampleEventfrom './event.js'
export default function router(app) {
	app
	.createSocketRouter('router')
	.event(exampleEvent(app))
	.middleware((io, socket, msg, cb, next)=>{
		console.log('hit router !')
		next()
	})
}
```
```javascript 
// index.js
import Bliz from 'bliz'
import router from './events-router.js'
const app = Bliz()

app
.sockets({useSockets: true, delimiter: ':'})
.registerSocketRouters(router(app))
.listen(4000)
```
Now if you fire an event to router:event it will pass through router middleware to route middleware to route handler, how cool is that ?
[Back to top](#table-of-contents)
# Graphql
Bliz uses graphql-tools and all the apollo packages to give you the easiest way to write graphql servers
we'll start with a schema:
```javascript
// schema.js
const  schema  =  `
type Post {
	name: String!
	id: Int!
	data: String
}
input newPost {
	name: String!
	id: Int!
	data: String
}
`
export  default  schema
```
```javascript
// resolver.js
const  resolver  = {
	Query:{
		Post(obj, args, context, info){
			return {name:'some name', id:args.id}
		}
	},
	Post:{
		name(post, args, context, info){
			return  post.name
		},
		id(post, args, context, info){
			return  post.id
		},
		data(post, args, context, info){
			return  post.data
		}
	},
	Subscription:(pubsub)=> ({
		postAdded: {
			subscribe:()=>{
				return  pubsub.asyncIterator('POST_ADDED')
			}
		}
	}),
	Mutation:(pubsub)=>({
		Post(obj, args, context, info){
			pubsub.publish('POST_ADDED', {postAdded:  args.input});
			return {...args.input}
		}
	})
}
export  default  resolver
```
Notice Mutation and Subscription are functions injected with pubsub, Bliz creates a local pubsub instance to use with graphql-subscriptions, you can pass your own pubsub implementation, like redis pubsub in 
```javascript 
app.graphql({pubsub: new yourOwnPubSub()})
```
Now, every time someone adds a post, who ever subscribes will get the updates, automatically!
let's continue...
```javascript
import  postSchema  from  './schema'
import  postResolver  from  './resolver'

// create a graphql schema with our schema and resolver, define query
// subscription and mutation
export  default  function  PostSchema (app) {
	return  app
	.createGraphQlSchema(postSchema)
	.resolver(postResolver)
	.query(`Post(id: Int!): Post`)
	.mutation(`Post(input: newPost): Post`)
	.subscription(`postAdded: Post`)
}
```
```javascript
import  Bliz  from  'bliz'
import  PostSchema  from  './Post'
app
.graphql({useGraphql:  true, useGraphiql:  true, tracing:  true})
.registerGraphQlSchemas(PostSchema(app))
.listen(4000)
```
And voila, you do not need anything else to fire a full graphql server with subscriptions.
Head to http://localhost:4000/graphiql - for testing playground
Head to http://localhost:4000/graphql - for your graphql api
Head to http://localhost:4000/subscriptions - for you real time goodness

[Back to top](#table-of-contents)
## Remote-schema-stitching
The graphql server we wrote just now can easily become part of a microservices style architecture without any changes, all we need to do is implement a gateway that wil stitch all responses and schemas for us.
```javascript
import  Bliz  from  'bliz'
const  app  =  Bliz()
app
.graphql({useGraphql:  true, useGraphiql:  true})
.registerRemoteGraphQlSchemas({
	url:'http://localhost:4000/graphql',
	ws:  'ws://localhost:4000/subscriptions'
 },{
	url:'http://localhost:5000/graphql',
	ws:  'ws://localhost:5000/subscriptions'
 })
.listen(5000)
```
Head over to http://localhost:6000 and you will see all you schemas in one.
[Back to top](#table-of-contents)

# Notes
Bliz is in version 0.1.0 and I implemented it as a proof of concept to a declarative web server supporting all kinds of technologies. I do not recommend using it in production untill version 1.0.0 is released. 
There are a lot of things to add, change and so many tests to write!
I hope people will get involved and we would create something awsome together.
[Back to top](#table-of-contents)

# Documentation
The examples shown here have only a fraction of the options included with Bliz, full documentation with every little detail coming soon!
Help would be appreciated!
[Back to top](#table-of-contents)

# Contributing
If you decide to contribute, first of all thanks!
steps:
 - clone project
 - npm install
 - create a seperate branch for you ideas or features
 - run prettier
 - submit a pull request

Everything in Bliz is written with [Concatenative Inheritance](https://medium.com/javascript-scene/the-heart-soul-of-prototypal-oo-concatenative-inheritance-a3b64cb27819) and [RORO](https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-roro-be01e7669cbd). I believe these are very powerful concepts and would appreciate any comments or ideas about these styles of writing software.

# License
The MIT License (MIT) 2018 - [Yuri Khomyakov](https://github.com/yuraxdrumz/). Please have a look at the [LICENSE.txt](https://github.com/yuraxdrumz/Bliz/blob/master/LICENSE.txt) for more details.