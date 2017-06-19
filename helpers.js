var isDeepEqual = require('lodash.isequal')

function defaultEqualityFn(oldArgs, newArgs){
  return isDeepEqual(oldArgs, newArgs)
}

function defaultKeyResolver(args){
  return JSON.stringify(args[0])
}

function ObjectCache () {
  this.clear()
}
ObjectCache.prototype.has = function (key) {
  return (key in this.cache)
}
ObjectCache.prototype.get = function (key) {
  return this.cache[key]
}
ObjectCache.prototype.set = function (key, value) {
  this.cache[key] = value
}
ObjectCache.prototype.clear = function (key, value) {
  this.cache = Object.create(null)
}
ObjectCache.prototype.removeOldKeys = function(size, entryOrder){
  const cache = this.cache

  var keys = Object.keys(cache)
  if(keys.length <= size){
    return
  }

  const maxAllowedOrder = entryOrder - size

  keys.forEach(function(key){
    if(cache[key].entryOrder < maxAllowedOrder){
      delete cache[key]
    }
  })

}

module.exports = {
  defaultEqualityFn: defaultEqualityFn,
  defaultKeyResolver: defaultKeyResolver,
  ObjectCache: ObjectCache,
  defaultSize: 100
}