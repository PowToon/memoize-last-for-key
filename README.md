# memoize-last-for-key

```
npm install memoize-last-for-key --save
```

Creates a function that caches the last result of arguments, by key calculated from the arguments.

This library is useful if you can conclude a key from function's arguments where it is expected to receive the same arguments and return the same results.

See example below.

## Info
The cache of the memoization function looks like this:
```
{
  [generatedKeyFromArgs]: {
    args: Array,            // full args of the cached call
    result: Any,            // results for the cached call
    entryOrder: Number      // order of the cachedId
  },
  ...
}

```
When a `lastMemoized` function is called:
1. we calculate it's key using `keyResolver`
1. if it doesn't exists in the cache, we calculate it's result and add it
    1. old keys are deleted of their number exceeds `size`
1. if it exists exists we compare it's args to previous args using `equalityFn`
    1. if the args are equal we return the cached result
    1. otherwise we run the function and add the result to the cache

## Example
```
const memoizeLast = require('memoize-last-for-key')

const config = {
  keyResolver: function(args){
    return args[0].id
  }
}

const updateItemPrice = memoizeLast(function(item, newPrice){

  // Some heavy calculation goes here.
  // If it's not heavy, don't use this library.
  
  return Object.assign({}, item, {price: newPrice})
}, config)

const item = {id: 1, name: 'item-1', price: 100}
const updatedItem =        updateItemPrice(item, 200)  //{id: 1, name: 'item-1', price: 200}
const anotherUpdatedItem = updateItemPrice(item, 200)  //{id: 1, name: 'item-1', price: 200}
// updatedItem === anotherUpdatedItem

const newItem = {id: 1, name: 'item-2', price: 100}
const newUpdatedItem = updateItemPrice(item, 200)  //{id: 1, price: 200}
// updatedItem !== newUpdatedItem because newItem is not item
 
```

## Options

```
{
  // Determines ow do we compare function's args to old args.
  // If this function returns true, the result is pulled from the cache.
  equalityFn: function defaultEqualityFn(oldArgs, newArgs){
    return isDeepEqual(oldArgs, newArgs)
  },
  
  // The key we store and retrieve `args` and `result` from the cache.
  // Upon retiraval we compare args to old args using `equalityFn` and decide if result should be recalculated.
  keyResolver: function defaultKeyResolver(args){
    return JSON.stringify(args[0])
  },
  
  // Number of keys in the hash table
  length: 100,
  
  // The `this` inside the memoize function
  context: null
}
```


