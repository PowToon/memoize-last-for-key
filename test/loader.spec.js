var expect = require('expect.js')
var memoize = require('../index')

describe('memoize-last-for-key', function () {
  'use strict'

  it('simple', function () {
    const memoizeFn = memoize(function(a, b){
      return a + b
    })

    expect(memoizeFn(5, 4)).to.equal(9)
    expect(memoizeFn('a', 'b')).to.equal('ab')
  })

  it('objects', function () {
    const memoizeFn = memoize(function(a, b){
      return {result: a.a + b.b}
    })

    const memoizeFirst = memoizeFn({a: 5}, {b: 4})
    expect(memoizeFirst).to.eql({result: 9})

    const memoizeSecond = memoizeFn({a: 5}, {b: 4})
    expect(memoizeSecond).to.be(memoizeFirst)

    const memoizeThird = memoizeFn({a: 5}, {b: 4, c: 0})
    expect(memoizeThird).to.not.be(memoizeFirst)
  })

  it('equalityFn', function(){
    const config = {
      equalityFn: function(oldArgs, newArgs){
        return (
          oldArgs[0].a === newArgs[0].a &&
          oldArgs[1].b === newArgs[1].b
        )
      }
    }

    const memoizeFn = memoize(function(a, b){
      return {result: a.a + b.b}
    }, config)

    const memoizeFirst = memoizeFn({a: 5}, {b: 4})
    expect(memoizeFirst).to.eql({result: 9})

    const memoizeSecond = memoizeFn({a: 5}, {b: 4})
    expect(memoizeFirst).to.be(memoizeSecond)
  })

  it('keyResolver', function () {
    const config = {
      equalityFn: function(oldArgs, newArgs){
        return (
          oldArgs[0].a === newArgs[0].a &&
          oldArgs[1].b === newArgs[1].b
        )
      },
      keyResolver: function (args) {
        return "" + args[0].a + args[0].b
      }
    }

    const memoizeFn = memoize(function(a, b){
      return {result: a.a + b.b}
    }, config)

    const firstResult = memoizeFn({a: 5}, {b: 4})
    expect(firstResult).to.eql({result: 9})

    const secondResult = memoizeFn({a: 10}, {b: 8})
    expect(secondResult).to.eql({result: 18})

    const thirdResult = memoizeFn({a: 5}, {b: 4})
    expect(thirdResult).to.eql({result: 9})
    expect(thirdResult).to.be(firstResult)

    const fourthResult = memoizeFn({a: 10}, {b: 8})
    expect(fourthResult).to.eql({result: 18})
    expect(fourthResult).to.be(secondResult)
  })

  it('size', function () {
    const config = {
      equalityFn: function(oldArgs, newArgs){
        return (
          oldArgs[0].a === newArgs[0].a &&
          oldArgs[1].b === newArgs[1].b
        )
      },
      keyResolver: function (args) {
        return "" + args[0].a + args[0].b
      },
      size: 1
    }

    const memoizeFn = memoize(function(a, b){
      return {result: a.a + b.b}
    }, config)

    const firstResult = memoizeFn({a: 5}, {b: 4})
    expect(firstResult).to.eql({result: 9})

    const secondResult = memoizeFn({a: 10}, {b: 8})
    expect(secondResult).to.eql({result: 18})

    const thirdResult = memoizeFn({a: 5}, {b: 4})
    expect(thirdResult).to.eql({result: 9})
    expect(thirdResult).to.not.be(firstResult)

    const fourthResult = memoizeFn({a: 10}, {b: 8})
    expect(fourthResult).to.eql({result: 18})
    expect(fourthResult).to.not.be(secondResult)

    const fifthResult = memoizeFn({a: 10}, {b: 8})
    expect(fifthResult).to.eql({result: 18})
    expect(fifthResult).to.be(fourthResult)
  })


})