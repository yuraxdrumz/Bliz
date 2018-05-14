// throw err and parse it to get file name and line num
let colors        = ['\x1b[31m','\x1b[32m','\x1b[33m','\x1b[35m','\x1b[36m'];
let underline     = '\x1b[4m';
const getStack = () => {
  try {
    throw new Error('throwing this to get info of caller')
  } catch (e) {
    const stack = e.stack.split('\n').slice(1)[2]
    const filename = stack.substr(stack.indexOf('(')).replace('(', '').replace(')', '')
    return filename
  }
}

// main function
const log = (getStack) => (...args) => {
  const random = Math.floor(Math.random() * colors.length)
  const prefix = underline + ' ' + colors[random] + getStack() + '\x1b[0m'
  switch (args.length) {
    case 0:
      console.log(`${prefix} no arguments were passed! \n`)
      break
    default:
      args.forEach(each => {
        each instanceof Error ? console.error(`${prefix} ${each.stack}`) : console.log(`${prefix} ${each}`)
      })
      break
  }
}

export default log(getStack)
