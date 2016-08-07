var merge  = require('./merge')
var typeOf = require('lutils-typeof')

exports["merge"] = function(test) {
    //
    // Basic merges
    //

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
    test.equal(merged.c, expected.c)
    test.equal(merged.d, 2)

    var merged2 = merge(
        { c: 'overwriteMe', d: 'overwriteMe' },
        { c: 1, d: 1, a: { b: 1 }, f: 1 },
        { a: { x: 1, b: 2 } }
    )

    test.equal(merged2.c, 1)
    test.equal(merged2.d, 1)
    test.equal(merged2.a.x, 1)
    test.equal(merged2.a.b, 2)
    test.equal(merged2.f, 1)

    //
    // Basic Merge depth test
    //

    var merged_basic = {
        a: { b: 1 }
    }

    merge([merged_basic, { a: 1 }], { depth: 0 })
    test.notEqual(merged_basic.a, 1, "basic depth test of 0")

    merge([merged_basic, { a: 1 }], { depth: 1 })
    test.equal(merged_basic.a, 1, "basic depth test of 1")

    //
    // Merge depth test
    //

    var merged3 = {
        a: { b: { c: 1 } }
    }

    var merged3_ab = merged3.a.b

    merge([
        merged3,
        {
            a: { b: { c: 2 } }
        },
    ], { depth: 2 })

    test.equal(merged3.a.b.c, 1, "same value")
    test.equal(merged3.a.b, merged3_ab, "same object reference")

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

exports["Can be called in all ways"] = function(test) {
    var obj1 = { a: 1 }
    var obj2 = { b: 1 }

    merge([obj1, obj2], function() { return true })

    test.ok(obj1.b === 1)

    obj1 = { a: 1 }
    obj2 = { b: 1 }

    merge([obj1, obj2], { depth: 3 }, function() { return false })

    test.ok(obj1.b === undefined)

    test.done()
}
