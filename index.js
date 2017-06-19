const helpers = require('./helpers')

module.exports = function keyArgsMemoize(fn, options){
  options = options || {}
  const keyResolver = options.keyResolver || helpers.defaultKeyResolver
  const equalityFn = options.equalityFn || helpers.defaultEqualityFn
  const size = options.size || helpers.defaultSize
  const context = options.context || this

  var entryOrder = 0
  function memoizeFn() {
    const args = Array.prototype.slice.call(arguments)

    const cache = memoizeFn.cache
    const key = keyResolver(args)

    const shouldAddKey = !cache.has(key)

    if(shouldAddKey || !equalityFn(cache.get(key).args, args)){
      cache.set(key, {
        entryOrder: entryOrder++,
        args: args,
        result: fn.apply(context, args)
      })
    }

    if(shouldAddKey){
      cache.removeOldKeys(size, entryOrder)
    }

    return cache.get(key).result
  }

  memoizeFn.cache = new helpers.ObjectCache()

  return memoizeFn
}
