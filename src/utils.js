const urlUtil = req => {
  const dividedUrl = req.url.split('/');
  const baseOfRequest = `/${dividedUrl[1]}`
  let method = req.method.toLowerCase()
  if(method === 'delete') method = 'deleted'
  let rest = `/${dividedUrl.slice(2).join('/')}`
  if(rest[rest.length - 1] === '/') rest = rest.slice(0,rest.length -1)
  return {
    baseOfRequest,
    method,
    rest
  }
}

export {
  urlUtil
}