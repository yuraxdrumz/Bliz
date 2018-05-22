
export default function team1 (app) {
  return app
  .createSocketListener('team1')
  .handler((io, socket, msg, cb, { mongoose })=>{
    mongoose()
    console.log('awsome')
  })
  .middleware((io, socket, msg, cb, next)=>{
    console.log('middleware!')
    next()
  })
  .middleware((io, socket, msg, cb, next)=>{
    console.log('middleware2!')
    next()
  })
}
