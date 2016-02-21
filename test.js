var merge  = require('./merge')
var typeOf = require('lutils-typeof')

exports["merge"] = function(test) {
    var expected = {
        a: { b: {} },
        c: { },
        d: 2
    }
    var merged = merge(
        { c: 'overwriteMe', d: 'overwriteMe' },
        expected
    )

    test.deepEqual(expected, merged)
    test.ok(merged.c === expected.c)
    test.ok(merged.d === 2)

    var merged2 = merge(
        { c: 'overwriteMe', d: 'overwriteMe' },
        { c: 1, d: 1, a: { b: 1 }, f: 1 },
        { a: { x: 1, b: 2 } }
    )

    test.ok(merged2.c === 1)
    test.ok(merged2.d === 1)
    test.ok(merged2.a.x === 1)
    test.ok(merged2.a.b === 2)
    test.ok(merged2.f === 1)

    test.done()
}

exports["merge.white"] = function(test) {
    var obj1 = { a: { notIgnored: false } }
    var obj2 = { a: { notIgnored: true, ignored: true } }

    merge.white(obj1, obj2)
    test.ok(obj1.a !== obj2.a)
    test.ok(obj1.a.notIgnored === true)
    test.ok(obj1.a.ignored === undefined)
    test.done()
}

exports["merge.black"] = function(test) {
    var obj1 = { a: { ignored: true } }
    var obj2 = { a: { ignored: false, notIgnored: true } }

    merge.black(obj1, obj2)
    test.ok(obj1.a !== obj2.a)
    test.ok(obj1.a.ignored === true)
    test.ok(obj1.a.notIgnored === true)
    test.done()
}
