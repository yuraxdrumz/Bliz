import defaultHandler from '../src/defaultHandler'

const req = {
  method:'GET',
  url:'url/data/never/mind'
}

const res = {
  statusCode:null,
  json:jest.fn(data=>data)
}

describe('Default Handler suite', ()=>{
  test('should throw err if request and response not passed', ()=>{
    expect(()=>defaultHandler()).toThrowError()
  })
  test('should put statusCode to 404 if 3rd param error not passed', ()=>{
    expect(defaultHandler(req, res)).not.toBeDefined()
    expect(res.statusCode).toEqual(404)
    expect(res.json.mock.calls[0][0]).toMatchSnapshot()
  })
  test('should put statusCode to err status if 3rd param error was passed', ()=>{
    res.json.mockClear()
    const error = {
      status:700,
      toString:jest.fn(()=>'error to string')
    }
    expect(defaultHandler(req, res, error)).not.toBeDefined()
    expect(res.statusCode).toEqual(700)
    expect(res.json.mock.calls[0][0]).toMatchSnapshot()
  })
  test('should put statusCode to 500 if error status is defined and 3rd param error was passed', ()=>{
    res.json.mockClear()
    const error = {
      toString:jest.fn(()=>'error to string')
    }
    expect(defaultHandler(req, res, error)).not.toBeDefined()
    expect(res.statusCode).toEqual(500)
    expect(res.json.mock.calls[0][0]).toMatchSnapshot()
  })
})