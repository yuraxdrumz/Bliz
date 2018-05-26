
export default function listener2 (app) {
  return app
  .createSocketListener('team2')
  .handler((io, socket, msg, cb)=>cb('awsomeee'))
  .middleware((io, socket, msg, cb, next)=>{
    console.log('another teams router middleware')
    next()
  })
}
