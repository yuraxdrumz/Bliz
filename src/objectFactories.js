// receive an http and a handler and return a listen func
const Listen = (http, handler) => ({
  listen:(...args)=>{
    const server = http.createServer(handler)
    return server.listen.apply(server, args)
  }
})

// method creator for router
const Method = (name, mem,chainLink) => ({
  [name]:route=>{mem[name][route.getObjProps().path] = route;return chainLink}
})


// assign creator
const CreateHandler = (name, mem, chainLink) =>({
  [name]:func=>{mem[name] = func;return chainLink}
})


// list object properties
const GetObjProps = obj =>({
  getObjProps:()=>(obj)
})

// when called, receives a router type
// returns a Router func which allows to create routers with Router and basepath provided
const CreateNewObjOf = (name, obj) => ({
  [`create${name}`]: path =>{
    return Object.assign(
      {},
      obj(path)
    )
  }
})

const CreateArray = (name, arr, chainLink) => ({
  [name]:data=>{arr.push(data);return chainLink}
})

export {
  CreateHandler,
  CreateArray,
  CreateNewObjOf,
  Method,
  GetObjProps,
  Listen
}