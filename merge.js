var typeOf = require('lutils-typeof')

/**
 *  Merges objects together
 */
var merge = function() {
    var options = parseOptions(arguments)

    options.tests.unshift(merge.tests.merge)

    return reducer(options)
}

/**
 *  Merges objects together, but only when keys dont match
 */

merge.black = function() {
    var options = parseOptions(arguments)

    options.tests.unshift(merge.tests.black)

    return reducer(options)
}

/**
 *  Merges objects together, but only when keys match
 */
merge.white = function() {
    var options = parseOptions(arguments)

    options.reversed = true
    options.tests.unshift(merge.tests.white)

    return reducer(options)
}

merge.tests = {
    merge: function(params) {
        if ( params.assigning ) return true

        return params.key in params.obj1
    },
    white: function(params) {
        if ( params.recursing ) return true

        return params.key in params.obj2
    },
    black: function(params) {
        if ( params.recursing ) return true

        return ! ( params.key in params.obj1 )
    },
}

module.exports = merge


//
// Private functions
//


function reducer(options) {
    return options.objects.slice(1).reduce(function(target, obj) {
        return iterate(target, obj, options.depth, options)
    }, options.objects[0])
}

function parseOptions(args) {
    var options = {
        depth: 8,
        types: { object: true, array: true },
        tests: []
    }

    args = Array.prototype.slice.call(args)
    var lastArg = args[ args.length - 1 ]

    if ( typeOf.Function(lastArg) ) {
        options.tests.push(lastArg)
        args.pop()
    }

    if ( typeOf.Array(args[0]) ) {
        if ( args[1] ) {
            options.depth = args[1].depth || options.depth
            options.types = castTypes( args[1].types || options.types )
            if ( args[1].test ) options.tests.push(args[1].test)
        }

        options.objects = args[0]
    } else {
        options.objects = args
    }

    return options
}

/**
 *  Iterates over two objects based on supplied options
 *
 *  @param     {Object}    obj1
 *  @param     {Object}    obj2
 *  @param     {Number}    depth
 *  @param     {Object}    options
 *
 *  @return    {Object}
 */
function iterate(obj1, obj2, depth, options) {
    if ( --depth <= 0 ) return obj1

    var iterated = options.reversed ? obj1 : obj2

    for ( var key in iterated ) {
        if ( ! obj2.hasOwnProperty(key) ) continue

        var obj1Type = typeOf(obj1[key])
        var obj2Type = typeOf(obj2[key])

        var testOptions = {
            obj1     : obj1,
            obj2     : obj2,
            iterated : iterated,
            key      : key,
            depth    : depth,
            options  : options,
            assigning: false,
            recursing: false,
        }

        if (
            ( obj2Type in options.types ) &&
            ( obj1Type in options.types)
        ) {
            testOptions.recursing = true
            if ( ! runTests(options.tests, testOptions) ) continue

            iterate(obj1[key], obj2[key], depth, options)
        } else {
            testOptions.assigning = true
            if ( ! runTests(options.tests, testOptions) ) continue

            obj1[key] = obj2[key]
        }
    }

    return obj1
}

function runTests(tests, options) {
    for ( var i in tests )
        if ( ! tests[i](options) ) return false

    return true
}

function castTypes(types) {
    if ( typeOf.Object( types ) ) return types

    return types.reduce(function(hash, key) { hash[key] = true; return hash }, {})
}
