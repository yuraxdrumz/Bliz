import { struct } from '../src/main'

export const paramSchema = struct({
  param: 'string?'
})
export const statusSchema = struct({
  status: 'string'
})

export const otherSchema = struct({
  lala:'number'
})

export const responseSchema = struct({
  data: otherSchema
})

export const querySchema = struct({
  ggg: 'string'
})

export const errorSchema = struct({
  error: 'string'
})
