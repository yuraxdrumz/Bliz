export async function resolveGraphqlOptions(options, ...args) {
  if (typeof options === 'function') {
    try {
      return await options(...args)
    } catch (e) {
      throw new Error(`Invalid options provided to ApolloServer: ${e.message}`)
    }
  } else {
    return options
  }
}
