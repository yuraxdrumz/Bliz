import team1 from './team1.listener'
import team2 from './team2.listener'

export default function socketRouter (app) {
  return app
  .createSocketRouter('teams')
  .event(team1(app))
  .event(team2(app))
  .middleware((io, socket, msg, cb, next)=>{
    console.log('teams router middleware')
    next()
  }, 5000)
}