
const End = handler => (req, res) => ({
  end:()=> handler(req, res)
})

const Method = (name, obj, chainLink) => ({
  [name]:(data)=> {
    obj[name] = data
    return chainLink
  }
})

const request = {
  url:null,
  method: null,
  params:{},
  query:{}

}

function json(data){
  console.log(data)
}
const response = {
  write:{},
  json,
  send:{},
  end:{},
  status:200,
  setHeader:{}
}

const Unter = function(blizApp){
  const _Instance = {}
  return Object.assign(
    _Instance,
    Method('method', request, _Instance),
    Method('url', request, _Instance),
    Method('params', request, _Instance),
    Method('query', request, _Instance),
    End(blizApp.handler)(request, response)
  )
}

export default Unter