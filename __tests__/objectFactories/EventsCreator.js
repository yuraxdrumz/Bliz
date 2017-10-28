// const EventsCreator = eventEmitter =>({
//   events:new eventEmitter({wildcard:true})
// })

import { EventsCreator } from '../../src/objectFactories'
import EventEmitter from 'events'

describe('EventsCreator suite', ()=>{
  test('should return object with key events and value instance of event emitter', ()=>{
    expect(EventsCreator(EventEmitter)).toHaveProperty('events', new EventEmitter());
  })
})