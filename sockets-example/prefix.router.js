import teamsRouter from './teams.router'
import team1 from './team1.listener'
import team2 from './team2.listener'

export default function prefixRouter (app){
  return app
    .createSocketRouter('prefix')
    .socketSubRouter(teamsRouter(app))
    .event(team1(app))
    .event(team2(app))
    .middleware((io, socket, msg, cb, next)=>{
      console.log('prefix router middleware')
      next()
    })
}
