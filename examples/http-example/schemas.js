import { struct } from '../../src/main'

const bodySchema = struct({
  name: 'string',
  last_name: 'string',
  address: 'string?'
})

export const paramSchema = struct({
  param: 'string?',
  body: bodySchema
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
